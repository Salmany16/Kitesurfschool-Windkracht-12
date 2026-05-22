<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Profile;
use App\Models\Booking;
use App\Models\Lesson;
use App\Models\SimulatedEmail;
use App\Models\Package;
use App\Models\Location;
use App\Models\Photo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    /**
     * List all users with their profiles.
     */
    public function getUsers()
    {
        $users = User::with('profile')
            ->where('id', '!=', auth()->id()) // Exclude current owner
            ->get();

        return response()->json([
            'users' => $users
        ]);
    }

    /**
     * Store a new user (Client or Instructor) directly.
     */
    public function storeUser(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:users,email',
            'name' => 'required|string|max:255',
            'role' => 'required|in:customer,instructor',
            'address' => 'required|string',
            'city' => 'required|string',
            'birthdate' => 'required|date',
            'mobile_number' => 'required|string',
            'bsn_number' => 'nullable|required_if:role,instructor|string',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'email_verified_at' => now(),
        ]);

        Profile::create([
            'user_id' => $user->id,
            'name' => $request->name,
            'address' => $request->address,
            'city' => $request->city,
            'birthdate' => $request->birthdate,
            'mobile_number' => $request->mobile_number,
            'bsn_number' => $request->bsn_number,
        ]);

        return response()->json([
            'message' => 'Gebruiker succesvol toegevoegd!',
            'user' => $user->load('profile')
        ]);
    }

    /**
     * Update an existing user and their profile.
     */
    public function updateUser(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'email' => 'required|email|unique:users,email,' . $id,
            'name' => 'required|string|max:255',
            'role' => 'required|in:customer,instructor',
            'address' => 'required|string',
            'city' => 'required|string',
            'birthdate' => 'required|date',
            'mobile_number' => 'required|string',
            'bsn_number' => 'nullable|string',
        ]);

        $user->email = $request->email;
        $user->role = $request->role;
        $user->name = $request->name;
        $user->save();

        $profile = Profile::firstOrCreate(['user_id' => $user->id]);
        $profile->update([
            'name' => $request->name,
            'address' => $request->address,
            'city' => $request->city,
            'birthdate' => $request->birthdate,
            'mobile_number' => $request->mobile_number,
            'bsn_number' => $request->bsn_number,
        ]);

        return response()->json([
            'message' => 'Gebruiker succesvol bijgewerkt!',
            'user' => $user->load('profile')
        ]);
    }

    /**
     * Delete a user.
     */
    public function deleteUser($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json([
            'message' => 'Gebruiker succesvol verwijderd.'
        ]);
    }

    /**
     * Toggle Block/Unblock access for a user.
     */
    public function toggleBlock($id)
    {
        $user = User::findOrFail($id);
        $user->is_blocked = !$user->is_blocked;
        $user->save();

        $statusStr = $user->is_blocked ? 'geblokkeerd' : 'gedeblokkeerd';

        return response()->json([
            'message' => "Gebruiker succesvol {$statusStr}.",
            'user' => $user
        ]);
    }

    /**
     * Change a user's role.
     */
    public function changeRole(Request $request, $id)
    {
        $request->validate([
            'role' => 'required|in:customer,instructor,owner'
        ]);

        $user = User::findOrFail($id);
        $user->role = $request->role;
        $user->save();

        return response()->json([
            'message' => "Gebruikersrol succesvol veranderd naar {$request->role}.",
            'user' => $user
        ]);
    }

    /**
     * Get unpaid bookings (status = 'voorlopig').
     */
    public function getUnpaidBookings()
    {
        $bookings = Booking::where('status', 'voorlopig')
            ->with(['customer.profile', 'package'])
            ->get();

        return response()->json([
            'bookings' => $bookings
        ]);
    }

    /**
     * Make a booking definitive (confirm payment).
     */
    public function confirmPayment($id)
    {
        $booking = Booking::with(['customer.profile', 'package', 'lessons.instructor.profile'])->findOrFail($id);
        
        $booking->status = 'definitief';
        $booking->save();

        // Retrieve customer & package details
        $customer = $booking->customer;
        $customerEmail = $customer->email;
        $customerName = $customer->profile->name ?? 'Klant';
        $packageName = $booking->package->name;

        // 1. Send confirmation email to Customer
        $customerSubject = "Betaling ontvangen! Je reservering is definitief - Kitesurfschool Windkracht-12";
        $customerBody = "<h2>Beste {$customerName},</h2>" .
                        "<p>Goed nieuws! We hebben je betaling voor boeking <b>#W12-{$booking->id}</b> ontvangen.</p>" .
                        "<p>Je reservering voor het pakket <b>{$packageName}</b> is nu <b>DEFINITIEF</b>.</p>" .
                        "<p>De kitesurflessen gaan door! Hier zijn de gereserveerde lesdata:</p>" .
                        "<ul>";

        foreach ($booking->lessons as $lesson) {
            $instName = $lesson->instructor->profile->name ?? 'Nader te bepalen';
            $dateFormatted = $lesson->lesson_date->format('Y-m-d');
            $timeslotLabel = $lesson->timeslot === 'morning' ? 'Ochtend' : 'Middag';
            $customerBody .= "<li>Les op <b>{$dateFormatted}</b> ({$timeslotLabel}) met instructeur {$instName} op locatie <b>{$booking->location}</b></li>";
        }

        $customerBody .= "</ul>" .
                         "<p>Zorg dat je op tijd op de locatie bent. Kitespullen, wetsuits en boards liggen voor je klaar!</p>" .
                         "<br><p>Met sportieve groet,<br>Terence Olieslager<br>Kitesurfschool Windkracht-12</p>";

        SimulatedEmail::create([
            'to_email' => $customerEmail,
            'subject' => $customerSubject,
            'body' => $customerBody,
        ]);

        // 2. Send confirmation emails to each assigned Instructor
        $notifiedInstructors = [];
        foreach ($booking->lessons as $lesson) {
            if ($lesson->instructor && !in_array($lesson->instructor_id, $notifiedInstructors)) {
                $instructor = $lesson->instructor;
                $instName = $instructor->profile->name ?? 'Instructeur';
                
                $instSubject = "Nieuwe definitieve les toegewezen! - Kitesurfschool Windkracht-12";
                $instBody = "<h2>Beste {$instName},</h2>" .
                            "<p>Er is een nieuwe les definitief bevestigd en aan jou toegewezen!</p>" .
                            "<p><b>Klant:</b> {$customerName} ({$customerEmail})<br>" .
                            "<b>Pakket:</b> {$packageName}<br>" .
                            "<b>Locatie:</b> {$booking->location}</p>" .
                            "<p><b>Jouw lesdata binnen deze boeking:</b></p>" .
                            "<ul>";

                // List lessons assigned to this specific instructor
                foreach ($booking->lessons->where('instructor_id', $instructor->id) as $l) {
                    $dateFormatted = $l->lesson_date->format('Y-m-d');
                    $timeslotLabel = $l->timeslot === 'morning' ? 'Ochtend' : 'Middag';
                    $instBody .= "<li>{$dateFormatted} ({$timeslotLabel})</li>";
                }

                $instBody .= "</ul>" .
                             "<p>Log in op je dashboard om je volledige dag-, week- en maandoverzicht te bekijken.</p>" .
                             "<br><p>Met sportieve groet,<br>Terence Olieslager</p>";

                SimulatedEmail::create([
                    'to_email' => $instructor->email,
                    'subject' => $instSubject,
                    'body' => $instBody,
                ]);

                $notifiedInstructors[] = $instructor->id;
            }
        }

        return response()->json([
            'message' => 'Betaling bevestigd! Reservering is nu definitief en de bevestigingsmails zijn verzonden.',
            'booking' => $booking
        ]);
    }

    /**
     * Get specific instructor's schedule for Owner's calendar viewer.
     */
    public function getInstructorLessons($instructorId)
    {
        $lessons = Lesson::where('instructor_id', $instructorId)
            ->with(['booking.customer.profile', 'booking.package'])
            ->get();

        return response()->json([
            'lessons' => $lessons
        ]);
    }

    // --- PACKAGES CRUD ---

    public function storePackage(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'duration_hours' => 'required|numeric|min:0.1',
            'price' => 'required|numeric|min:0',
            'max_persons' => 'required|integer|min:1',
            'lessons_count' => 'required|integer|min:1',
        ]);

        $package = Package::create($validated);

        return response()->json([
            'message' => 'Pakket succesvol aangemaakt!',
            'package' => $package
        ], 210); // Custom success code or 201
    }

    public function updatePackage(Request $request, $id)
    {
        $package = Package::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'duration_hours' => 'required|numeric|min:0.1',
            'price' => 'required|numeric|min:0',
            'max_persons' => 'required|integer|min:1',
            'lessons_count' => 'required|integer|min:1',
        ]);

        $package->update($validated);

        return response()->json([
            'message' => 'Pakket succesvol bijgewerkt!',
            'package' => $package
        ]);
    }

    public function deletePackage($id)
    {
        $package = Package::findOrFail($id);
        $package->delete();

        return response()->json([
            'message' => 'Pakket succesvol verwijderd.'
        ]);
    }

    // --- LOCATIONS CRUD ---

    public function storeLocation(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:locations,name|max:255',
            'difficulty' => 'required|string|in:beginner,intermediate,advanced',
            'difficulty_label' => 'required|string|max:255',
            'water_type' => 'required|string|max:255',
            'wind_directions' => 'required|string|max:255',
            'crowd_level' => 'required|string|max:255',
            'description' => 'required|string',
            'safety_tips' => 'required|string',
            'icon' => 'required|string|max:10',
        ]);

        $location = Location::create($validated);

        return response()->json([
            'message' => 'Locatie succesvol aangemaakt!',
            'location' => $location
        ], 210);
    }

    public function updateLocation(Request $request, $id)
    {
        $location = Location::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:locations,name,' . $id,
            'difficulty' => 'required|string|in:beginner,intermediate,advanced',
            'difficulty_label' => 'required|string|max:255',
            'water_type' => 'required|string|max:255',
            'wind_directions' => 'required|string|max:255',
            'crowd_level' => 'required|string|max:255',
            'description' => 'required|string',
            'safety_tips' => 'required|string',
            'icon' => 'required|string|max:10',
        ]);

        $location->update($validated);

        return response()->json([
            'message' => 'Locatie succesvol bijgewerkt!',
            'location' => $location
        ]);
    }

    public function deleteLocation($id)
    {
        $location = Location::findOrFail($id);
        $location->delete();

        return response()->json([
            'message' => 'Locatie succesvol verwijderd.'
        ]);
    }

    // --- PHOTOS CRUD ---

    public function storePhoto(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'spot' => 'required|string|max:255',
            'kiter' => 'required|string|max:255',
            'wind' => 'required|string|max:255',
            'gear' => 'required|string|max:255',
            'description' => 'required|string',
            'img_url' => 'nullable|string|max:255|required_without:gradient',
            'gradient' => 'nullable|string|max:255|required_without:img_url',
            'icon' => 'nullable|string|max:10|required_without:img_url',
        ]);

        $photo = Photo::create($validated);

        return response()->json([
            'message' => 'Foto succesvol toegevoegd aan de galerij!',
            'photo' => $photo
        ], 210);
    }

    public function updatePhoto(Request $request, $id)
    {
        $photo = Photo::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'spot' => 'required|string|max:255',
            'kiter' => 'required|string|max:255',
            'wind' => 'required|string|max:255',
            'gear' => 'required|string|max:255',
            'description' => 'required|string',
            'img_url' => 'nullable|string|max:255|required_without:gradient',
            'gradient' => 'nullable|string|max:255|required_without:img_url',
            'icon' => 'nullable|string|max:10|required_without:img_url',
        ]);

        $photo->update($validated);

        return response()->json([
            'message' => 'Foto succesvol bijgewerkt!',
            'photo' => $photo
        ]);
    }

    public function deletePhoto($id)
    {
        $photo = Photo::findOrFail($id);
        $photo->delete();

        return response()->json([
            'message' => 'Foto succesvol verwijderd.'
        ]);
    }
}
