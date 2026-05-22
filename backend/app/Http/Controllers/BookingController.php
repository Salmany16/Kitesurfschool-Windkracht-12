<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Package;
use App\Models\Booking;
use App\Models\Lesson;
use App\Models\SimulatedEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BookingController extends Controller
{
    /**
     * Get available spots and instructors.
     */
    public function getMetadata()
    {
        $spots = \App\Models\Location::pluck('name');
        
        $instructors = User::where('role', 'instructor')
            ->where('is_blocked', false)
            ->with('profile')
            ->get();

        $packages = Package::all();

        return response()->json([
            'spots' => $spots,
            'instructors' => $instructors,
            'packages' => $packages,
        ]);
    }

    /**
     * Get all locations.
     */
    public function getLocations()
    {
        return response()->json([
            'locations' => \App\Models\Location::all()
        ]);
    }

    /**
     * Get all gallery photos.
     */
    public function getPhotos()
    {
        return response()->json([
            'photos' => \App\Models\Photo::all()
        ]);
    }

    /**
     * Create a new booking.
     */
    public function store(Request $request)
    {
        $request->validate([
            'package_id' => 'required|exists:packages,id',
            'location' => 'required|string',
            'lessons' => 'required|array',
            'lessons.*.date' => 'required|date|after_or_equal:today',
            'lessons.*.timeslot' => 'required|in:morning,afternoon',
            // Duo fields are optional/required depending on package
            'duo_name' => 'nullable|string|max:255',
            'duo_address' => 'nullable|string|max:255',
            'duo_city' => 'nullable|string|max:255',
        ]);

        $user = Auth::user();
        $package = Package::find($request->package_id);

        // Verify lessons count matches package requirement
        if (count($request->lessons) !== $package->lessons_count) {
            return response()->json([
                'message' => "Voor dit pakket moet je precies {$package->lessons_count} lesdatum(s) selecteren."
            ], 422);
        }

        // Duo verification
        $isDuo = $package->max_persons > 1;
        if ($isDuo) {
            if (empty($request->duo_name) || empty($request->duo_address) || empty($request->duo_city)) {
                return response()->json([
                    'message' => 'Vul alstublieft de NAW-gegevens van de duo-deelnemer in.'
                ], 422);
            }
        }

        // Create the booking
        $booking = Booking::create([
            'customer_id' => $user->id,
            'package_id' => $package->id,
            'location' => $request->location,
            'status' => 'voorlopig',
            'customer_marked_paid' => false,
            'duo_name' => $isDuo ? $request->duo_name : null,
            'duo_address' => $isDuo ? $request->duo_address : null,
            'duo_city' => $isDuo ? $request->duo_city : null,
        ]);

        // Schedule individual lessons
        // Try to assign a unique free instructor for each lesson, or fallback
        $instructors = User::where('role', 'instructor')->where('is_blocked', false)->get();

        foreach ($request->lessons as $lessonData) {
            $assignedInstructorId = null;

            // Find an instructor who has no lessons scheduled at this date and timeslot
            foreach ($instructors as $inst) {
                $busy = Lesson::where('instructor_id', $inst->id)
                    ->where('lesson_date', $lessonData['date'])
                    ->where('timeslot', $lessonData['timeslot'])
                    ->where('status', 'scheduled')
                    ->exists();

                if (!$busy) {
                    $assignedInstructorId = $inst->id;
                    break;
                }
            }

            // Fallback if everyone is busy: assign first instructor
            if (!$assignedInstructorId && count($instructors) > 0) {
                $assignedInstructorId = $instructors[0]->id;
            }

            Lesson::create([
                'booking_id' => $booking->id,
                'instructor_id' => $assignedInstructorId,
                'lesson_date' => $lessonData['date'],
                'timeslot' => $lessonData['timeslot'],
                'status' => 'scheduled',
            ]);
        }

        // Calculate total amount (duo lessons require double payment because price is per person!)
        $multiplier = $isDuo ? 2 : 1;
        $totalAmount = $package->price * $multiplier;

        // Compose simulated payment details email
        $subject = "Betalingsgegevens reservering - Kitesurfschool Windkracht-12";
        $body = "<h2>Beste {$user->name},</h2>" .
                "<p>Bedankt voor je reservering bij Kitesurfschool Windkracht-12!</p>" .
                "<p>Hieronder vind je de details en de betalingsinstructies:</p>" .
                "<table style='border:1px solid #ddd;border-collapse:collapse;width:100%;max-width:500px;'>" .
                "<tr><td style='padding:8px;border:1px solid #ddd;'><b>Pakket:</b></td><td style='padding:8px;border:1px solid #ddd;'>{$package->name}</td></tr>" .
                "<tr><td style='padding:8px;border:1px solid #ddd;'><b>Locatie:</b></td><td style='padding:8px;border:1px solid #ddd;'>{$request->location}</td></tr>" .
                "<tr><td style='padding:8px;border:1px solid #ddd;'><b>Aantal personen:</b></td><td style='padding:8px;border:1px solid #ddd;'>{$multiplier}</td></tr>" .
                "<tr><td style='padding:8px;border:1px solid #ddd;'><b>Prijs p.p.:</b></td><td style='padding:8px;border:1px solid #ddd;'>&euro; " . number_format($package->price, 2, ',', '.') . "</td></tr>" .
                "<tr style='background-color:#f0f9ff;'><td style='padding:8px;border:1px solid #ddd;'><b>Totaalbedrag:</b></td><td style='padding:8px;border:1px solid #ddd;'><b>&euro; " . number_format($totalAmount, 2, ',', '.') . "</b></td></tr>" .
                "</table>";

        if ($isDuo) {
            $body .= "<p><b>Duo-lesser gegevens:</b><br>" .
                     "Naam: {$request->duo_name}<br>" .
                     "Adres: {$request->duo_address}, {$request->duo_city}</p>";
        }

        $body .= "<p><b>Betalingsinstructies:</b><br>" .
                 "Maak het totaalbedrag van <b>&euro; " . number_format($totalAmount, 2, ',', '.') . "</b> over naar rekening:<br>" .
                 "<b>NL99 INGB 0123 4567 89</b> t.n.v. <b>Kitesurfschool Windkracht-12</b><br>" .
                 "Vermeld bij het overmaken je boekingsnummer: <b>#W12-{$booking->id}</b>.</p>" .
                 "<p><i>Let op: Je reservering is pas definitief zodra we de betaling hebben ontvangen! Geef in de app aan wanneer je hebt betaald.</i></p>" .
                 "<br><p>Met vriendelijke groet,<br>Terence Olieslager</p>";

        SimulatedEmail::create([
            'to_email' => $user->email,
            'subject' => $subject,
            'body' => $body,
        ]);

        return response()->json([
            'message' => 'Boeking succesvol aangemaakt! Betalingsgegevens zijn per e-mail verstuurd.',
            'booking' => $booking->load('lessons.instructor.profile')
        ]);
    }

    /**
     * Customer marks their booking as paid.
     */
    public function markAsPaid($id)
    {
        $user = Auth::user();
        $booking = Booking::where('id', $id)->where('customer_id', $user->id)->firstOrFail();

        $booking->customer_marked_paid = true;
        $booking->save();

        return response()->json([
            'message' => 'Je hebt aangegeven dat het bedrag is overgemaakt. De eigenaar zal dit controleren en de boeking definitief maken!',
            'booking' => $booking
        ]);
    }

    /**
     * List current user's bookings.
     */
    public function myBookings()
    {
        $user = Auth::user();
        $bookings = Booking::where('customer_id', $user->id)
            ->with(['package', 'lessons.instructor.profile'])
            ->get();

        return response()->json([
            'bookings' => $bookings
        ]);
    }

    /**
     * Customer cancels a lesson date and submits a reason.
     */
    public function cancelLessonCustomer(Request $request, $lessonId)
    {
        $request->validate([
            'reason' => 'required|string|min:5',
        ]);

        $user = Auth::user();
        // Secure lesson fetch to ensure it belongs to this customer
        $lesson = Lesson::where('id', $lessonId)
            ->whereHas('booking', function ($query) use ($user) {
                $query->where('customer_id', $user->id);
            })
            ->firstOrFail();

        $lesson->status = 'cancelled';
        $lesson->cancellation_reason = $request->reason;
        $lesson->cancellation_source = 'customer';
        $lesson->save();

        // Trigger simulated email notifications to Owner and Instructor
        $booking = $lesson->booking()->with('customer.profile')->first();
        $customerName = $booking->customer->profile->name ?? $booking->customer->name;
        $dateFormatted = $lesson->lesson_date;
        if ($dateFormatted instanceof \Carbon\Carbon) {
            $dateFormatted = $dateFormatted->format('Y-m-d');
        }
        $timeslotLabel = $lesson->timeslot === 'morning' ? 'Ochtend' : 'Middag';
        
        $emailSubject = "Les geannuleerd door klant - Kitesurfschool Windkracht-12";
        $emailBody = "<h2>Beste,</h2>" .
                     "<p>De klant <b>{$customerName}</b> heeft een geplande les geannuleerd.</p>" .
                     "<p><b>Les Details:</b><br>" .
                     "Datum: {$dateFormatted}<br>" .
                     "Dagdeel: {$timeslotLabel}<br>" .
                     "Boekingsnummer: #W12-{$booking->id}</p>" .
                     "<p><b>Reden voor annulering:</b><br>" .
                     "<i>{$request->reason}</i></p>";

        // Send to owner
        SimulatedEmail::create([
            'to_email' => 'owner@windkracht12.nl',
            'subject' => $emailSubject,
            'body' => $emailBody,
        ]);

        // Send to instructor if assigned
        if ($lesson->instructor_id) {
            $instructor = User::find($lesson->instructor_id);
            if ($instructor) {
                SimulatedEmail::create([
                    'to_email' => $instructor->email,
                    'subject' => $emailSubject,
                    'body' => $emailBody,
                ]);
            }
        }

        return response()->json([
            'message' => 'Les geannuleerd. Je kunt nu een nieuwe lesdatum inplannen binnen je pakket.',
            'lesson' => $lesson
        ]);
    }

    /**
     * Reschedule a cancelled lesson to a new date and timeslot.
     */
    public function rescheduleLesson(Request $request, $lessonId)
    {
        $request->validate([
            'date' => 'required|date|after_or_equal:today',
            'timeslot' => 'required|in:morning,afternoon',
        ]);

        $user = Auth::user();
        $lesson = Lesson::where('id', $lessonId)
            ->whereHas('booking', function ($query) use ($user) {
                $query->where('customer_id', $user->id);
            })
            ->firstOrFail();

        if ($lesson->status !== 'cancelled') {
            return response()->json(['message' => 'Deze les is niet geannuleerd en kan niet worden herpland.'], 400);
        }

        // Auto-assign instructor
        $instructors = User::where('role', 'instructor')->where('is_blocked', false)->get();
        $assignedInstructorId = null;

        foreach ($instructors as $inst) {
            $busy = Lesson::where('instructor_id', $inst->id)
                ->where('lesson_date', $request->date)
                ->where('timeslot', $request->timeslot)
                ->where('status', 'scheduled')
                ->exists();

            if (!$busy) {
                $assignedInstructorId = $inst->id;
                break;
            }
        }

        if (!$assignedInstructorId && count($instructors) > 0) {
            $assignedInstructorId = $instructors[0]->id;
        }

        // Reset lesson with new schedule details
        $lesson->lesson_date = $request->date;
        $lesson->timeslot = $request->timeslot;
        $lesson->instructor_id = $assignedInstructorId;
        $lesson->status = 'scheduled';
        $lesson->cancellation_reason = null;
        $lesson->cancellation_source = null;
        $lesson->save();

        return response()->json([
            'message' => 'Les succesvol herpland naar een nieuwe datum!',
            'lesson' => $lesson->load('instructor.profile')
        ]);
    }

    /**
     * Instructor or Owner cancels a lesson (Sickness or Bad Weather).
     */
    public function cancelLessonStaff(Request $request, $lessonId)
    {
        $request->validate([
            'type' => 'required|in:sickness,weather',
        ]);

        $user = Auth::user();
        
        // Ensure user is instructor or owner
        if (!in_array($user->role, ['instructor', 'owner'])) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $lesson = Lesson::with(['booking.customer', 'instructor.profile'])->findOrFail($lessonId);

        // Standardized messages & reasons
        $reason = '';
        $subject = '';
        $body = '';

        $customer = $lesson->booking->customer;
        $instructorName = $lesson->instructor->profile->name ?? 'Je instructeur';

        $dateFormatted = $lesson->lesson_date->format('Y-m-d');
        $timeslotLabel = $lesson->timeslot === 'morning' ? 'Ochtend' : 'Middag';

        if ($request->type === 'sickness') {
            $reason = "Ziekte van de instructeur ({$instructorName})";
            $subject = "BELANGRIJK: Les geannuleerd wegens ziekte instructeur - Kitesurfschool Windkracht-12";
            $body = "<h2>Beste {$customer->name},</h2>" .
                    "<p>Helaas moeten we je informeren dat je geplande kitesurflas op <b>{$dateFormatted} ({$timeslotLabel})</b> is geannuleerd.</p>" .
                    "<p><b>Reden:</b> De instructeur ({$instructorName}) is wegens ziekte verhinderd.</p>" .
                    "<p>Je kunt via de webapp inloggen op je dashboard om direct kosteloos een nieuwe vervangende datum te kiezen!</p>" .
                    "<br><p>Met excuses voor het ongemak,<br>Kitesurfschool Windkracht-12</p>";
        } else {
            $reason = "Slechte weersomstandigheden (Windkracht > 10)";
            $subject = "BELANGRIJK: Les geannuleerd wegens weersomstandigheden - Kitesurfschool Windkracht-12";
            $body = "<h2>Beste {$customer->name},</h2>" .
                    "<p>Helaas is de windkracht op <b>{$dateFormatted} ({$timeslotLabel})</b> te sterk (windkracht > 10 Bft). Veiligheid staat voorop!</p>" .
                    "<p>Daarom is je les wegens slechte weersomstandigheden geannuleerd door instructeur <b>{$instructorName}</b>.</p>" .
                    "<p>Log in op de webapp en plan direct een nieuwe lesdatum in passend bij je pakket.</p>" .
                    "<br><p>Met sportieve groet,<br>Kitesurfschool Windkracht-12</p>";
        }

        $lesson->status = 'cancelled';
        $lesson->cancellation_reason = $reason;
        $lesson->cancellation_source = $user->role;
        $lesson->cancellation_mail_sent = true;
        $lesson->save();

        // Write simulated email
        SimulatedEmail::create([
            'to_email' => $customer->email,
            'subject' => $subject,
            'body' => $body,
        ]);

        return response()->json([
            'message' => 'Les succesvol geannuleerd. Standaard e-mail is verstuurd naar de klant.',
            'lesson' => $lesson
        ]);
    }

    /**
     * Instructor Schedule (List of assigned lessons).
     */
    public function instructorSchedule()
    {
        $user = Auth::user();
        if ($user->role !== 'instructor' && $user->role !== 'owner') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $lessons = Lesson::where('instructor_id', $user->id)
            ->with(['booking.customer.profile', 'booking.package'])
            ->get();

        return response()->json([
            'lessons' => $lessons
        ]);
    }
}
