<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Route middleware: account_type:internal  or  account_type:external
 * Gates the Community Events module to internal employees and the
 * Career ATS / Factory Tour "my bookings" module to external users,
 * mirroring the frontend's applicant-shell.tsx NAV_INTERNAL / NAV_EXTERNAL split.
 */
class EnsureAccountType
{
    public function handle(Request $request, Closure $next, string $type): Response
    {
        $user = $request->user();

        if (! $user || $user->account_type !== $type) {
            abort(403, "This module is only available to {$type} accounts.");
        }

        return $next($request);
    }
}
