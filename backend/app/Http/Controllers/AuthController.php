<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Profile;
use App\Models\SimulatedEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    /**
     * Helper to log authentication activity to auth_activity.log with microsecond accuracy.
     */
    private function logAuthActivity(string $action, string $email): void
    {
        $microtime = microtime(true);
        $microSeconds = sprintf("%06d", ($microtime - floor($microtime)) * 1000000);
        $timestamp = date('Y-m-d H:i:s', $microtime) . '.' . $microSeconds;
        $logLine = "[" . $timestamp . "] " . strtoupper($action) . ": " . $email . PHP_EOL;
        
        file_put_contents(storage_path('logs/auth_activity.log'), $logLine, FILE_APPEND);
    }

    /**
     * 1. Register a potential client using only their email.
     */
    public function register(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:users,email',
        ]);

        $activationToken = Str::random(60);

        $user = User::create([
            'email' => $request->email,
            'role' => 'customer',
            'is_blocked' => false,
            'activation_token' => $activationToken,
        ]);

        // Create the activation link dynamically based on frontend origin
        $origin = $request->header('Origin') ?? 'http://127.0.0.1:5175';
        $activationLink = rtrim($origin, '/') . "/activate/" . $activationToken;

        // Compose simulated email
        $subject = "Welkom bij Kitesurfschool Windkracht-12 - Activeer je account";
        $body = "<h2>Beste toekomstige kiter,</h2>" .
                "<p>Welkom bij Kitesurfschool Windkracht-12! We zijn ontzettend enthousiast om je te helpen het water op te gaan.</p>" .
                "<p>Om je registratie te voltooien en je wachtwoord in te stellen, klik op de onderstaande link:</p>" .
                "<p><a href='{$activationLink}' style='background-color:#0284c7;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;display:inline-block;'>Account Activeren</a></p>" .
                "<p>Of kopieer deze link in je browser:<br>{$activationLink}</p>" .
                "<br><p>Met sportieve groet,<br>Terence Olieslager<br>Kitesurfschool Windkracht-12</p>";

        // Log the email in database for simulated mailbox
        SimulatedEmail::create([
            'to_email' => $user->email,
            'subject' => $subject,
            'body' => $body,
        ]);

        // Also write email to standard Laravel log
        \Log::info("Simulated Registration Email sent to {$user->email} with activation token: {$activationToken}. Link: {$activationLink}");

        return response()->json([
            'message' => 'Registratie gestart! Er is een activatiemail gestuurd naar je e-mailadres.',
            'email' => $user->email
        ]);
    }

    /**
     * 2. Activate account by submitting a secure password.
     */
    public function activate(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
            'password' => 'required|string|confirmed',
        ]);

        $user = User::where('activation_token', $request->token)->first();

        if (!$user) {
            return response()->json(['message' => 'Ongeldige of verlopen activatietoken.'], 400);
        }

        $password = $request->password;

        // Enforce password criteria:
        // - Min 12 characters
        // - At least one uppercase letter
        // - At least one digit
        // - At least one special character
        if (strlen($password) < 12) {
            return response()->json(['message' => 'Wachtwoord moet minimaal 12 tekens lang zijn.'], 422);
        }

        if (!preg_match('/[A-Z]/', $password)) {
            return response()->json(['message' => 'Wachtwoord moet minimaal één hoofdletter bevatten.'], 422);
        }

        if (!preg_match('/[0-9]/', $password)) {
            return response()->json(['message' => 'Wachtwoord moet minimaal één cijfer bevatten.'], 422);
        }

        if (!preg_match('/[^A-Za-z0-9]/', $password)) {
            return response()->json(['message' => 'Wachtwoord moet minimaal één leesteken bevatten (bijv. @, #, !, ?).'], 422);
        }

        $user->password = Hash::make($password);
        $user->activation_token = null;
        $user->email_verified_at = now();
        
        // Auto-login after activation: generate api_token
        $apiToken = Str::random(60);
        $user->api_token = $apiToken;
        $user->save();

        // Create empty profile if not existing
        $profile = Profile::firstOrCreate(
            ['user_id' => $user->id],
            ['name' => 'Klant ' . rand(100, 999)]
        );

        // Log login microsecond-accurate
        $this->logAuthActivity('login', $user->email);

        return response()->json([
            'message' => 'Account succesvol geactiveerd en ingelogd!',
            'token' => $apiToken,
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'role' => $user->role,
                'name' => $user->name,
                'profile' => $profile
            ]
        ]);
    }

    /**
     * 3. Standard Login
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Ongeldige inloggegevens.'], 401);
        }

        if ($user->is_blocked) {
            return response()->json(['message' => 'Dit account is geblokkeerd door de beheerder.'], 403);
        }

        // Generate api_token
        $apiToken = Str::random(60);
        $user->api_token = $apiToken;
        $user->save();

        // Ensure a profile exists
        $profile = Profile::firstOrCreate(
            ['user_id' => $user->id],
            ['name' => $user->name ?? explode('@', $user->email)[0]]
        );

        // Log login microsecond-accurate
        $this->logAuthActivity('login', $user->email);

        return response()->json([
            'message' => 'Succesvol ingelogd!',
            'token' => $apiToken,
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'role' => $user->role,
                'name' => $user->name,
                'profile' => $profile
            ]
        ]);
    }

    /**
     * 4. Standard Logout
     */
    public function logout(Request $request)
    {
        $user = Auth::user();

        if ($user) {
            $user->api_token = null;
            $user->save();

            // Log logout microsecond-accurate
            $this->logAuthActivity('logout', $user->email);
        }

        return response()->json([
            'message' => 'Succesvol uitgelogd.'
        ]);
    }

    /**
     * 5. Change Password
     */
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|confirmed',
        ]);

        $user = Auth::user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Huidige wachtwoord is onjuist.'], 422);
        }

        $password = $request->new_password;

        // Enforce criteria
        if (strlen($password) < 12) {
            return response()->json(['message' => 'Nieuw wachtwoord moet minimaal 12 tekens lang zijn.'], 422);
        }

        if (!preg_match('/[A-Z]/', $password)) {
            return response()->json(['message' => 'Nieuw wachtwoord moet minimaal één hoofdletter bevatten.'], 422);
        }

        if (!preg_match('/[0-9]/', $password)) {
            return response()->json(['message' => 'Nieuw wachtwoord moet minimaal één cijfer bevatten.'], 422);
        }

        if (!preg_match('/[^A-Za-z0-9]/', $password)) {
            return response()->json(['message' => 'Nieuw wachtwoord moet minimaal één leesteken bevatten (bijv. @, #, !, ?).'], 422);
        }

        $user->password = Hash::make($password);
        $user->save();

        return response()->json([
            'message' => 'Wachtwoord succesvol gewijzigd!'
        ]);
    }

    /**
     * 6. Retrieve authenticated profile
     */
    public function me(Request $request)
    {
        $user = Auth::user();
        $user->load('profile');

        return response()->json([
            'user' => $user
        ]);
    }
}
