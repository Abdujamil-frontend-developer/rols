<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, $permission): Response
    {
        $user = $request->user();

        if ($user && $user->login === 'admin') {
            return $next($request);
        }

        if (!$user || !is_array($user->access) || !in_array($permission, $user->access)) {
            return response()->json(['message' => 'Permission denied'], 403);
        }
        return $next($request);
    }
}
