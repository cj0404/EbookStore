<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAuthenticated
{
    public function handle(Request $request, Closure $next): Response
    {
        $userId = $request->session()->get('auth_user_id');
        $user = $userId ? User::find($userId) : null;

        if (! $user) {
            return redirect()->route('login')->with('error', 'Please sign in to continue.');
        }

        $request->attributes->set('auth_user', $user);

        return $next($request);
    }
}
