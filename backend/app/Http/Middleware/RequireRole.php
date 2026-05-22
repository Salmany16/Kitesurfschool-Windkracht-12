<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RequireRole
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized: Please log in.'], 401);
        }

        // Owner has access to EVERYTHING
        if ($user->role === 'owner') {
            return $next($request);
        }

        if (!in_array($user->role, $roles)) {
            return response()->json(['message' => 'Forbidden: You do not have the required role.'], 403);
        }

        return $next($request);
    }
}
