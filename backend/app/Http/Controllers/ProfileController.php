<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Profile;

class ProfileController extends Controller
{
    /**
     * Update the authenticated user's profile details.
     */
    public function update(Request $request)
    {
        $user = Auth::user();

        $rules = [
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'birthdate' => 'required|date',
            'mobile_number' => 'required|string|max:20',
        ];

        // Only instructors and owner can set or edit BSN number
        if (in_array($user->role, ['instructor', 'owner'])) {
            $rules['bsn_number'] = 'required|string|max:15';
        }

        $validated = $request->validate($rules);

        $profile = Profile::firstOrCreate(
            ['user_id' => $user->id]
        );

        $profile->update($validated);

        // Also update name on user record for convenience
        $user->name = $validated['name'];
        $user->save();

        return response()->json([
            'message' => 'Persoonsgegevens succesvol bijgewerkt!',
            'profile' => $profile,
            'user' => $user
        ]);
    }
}
