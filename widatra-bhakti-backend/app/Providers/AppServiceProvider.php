<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Admin console "content" modules (Products, News, CSR, CMS, Media)
        Gate::define('manage-content', function ($user) {
            return in_array($user->role, [
                'Super Admin',
                'Content Admin',
                'Administrator',
                'Content Editor',
                'CSR Coordinator',
                'HR Manager',
            ], true) || $user->hasRole(['Super Admin', 'Content Admin']);
        });

        // Admin > Users & Role Management — Super Admin & Administrator only.
        Gate::define('manage-users', function ($user) {
            return in_array($user->role, ['Super Admin', 'Administrator'], true)
                || $user->hasRole(['Super Admin', 'Administrator']);
        });

        // Any of the four admin-console roles may open /admin at all.
        Gate::define('access-admin', function ($user) {
            return $user->isAdminRole();
        });
    }
}
