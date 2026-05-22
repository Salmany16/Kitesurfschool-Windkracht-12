<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateWithToken
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $authHeader = $request->header('Authorization');

        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return response()->json(['message' => 'Unauthorized: Missing or invalid token format.'], 401);
        }

        $token = substr($authHeader, 7);
        $user = User::where('api_token', $token)->first();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized: Invalid token.'], 401);
        }

        if ($user->is_blocked) {
            return response()->json(['message' => 'Access Denied: This account has been blocked.'], 403);
        }

        // Authenticate the user for the current request context
        Auth::setUser($user);

        return $next($request);
    }
}
