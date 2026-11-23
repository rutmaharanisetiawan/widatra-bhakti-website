<?php

namespace App\Policies;

use App\Models\Application;
use App\Models\User;

class ApplicationPolicy
{
    /** HR staff can see/manage every application. */
    public function manageAny(User $user): bool
    {
        return in_array($user->role, ['Super Admin', 'Administrator', 'HR Manager'], true) || $user->hasRole(['Super Admin', 'HR Manager']);
    }

    public function view(User $user, Application $application): bool
    {
        return $this->manageAny($user) || $application->user_id === $user->id;
    }

    /** Only the owning external applicant may create/withdraw their own application. */
    public function create(User $user): bool
    {
        return $user->isExternal();
    }

    public function update(User $user, Application $application): bool
    {
        return $this->manageAny($user);
    }
}
