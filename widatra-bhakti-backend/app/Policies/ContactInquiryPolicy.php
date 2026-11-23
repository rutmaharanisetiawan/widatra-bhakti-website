<?php

namespace App\Policies;

use App\Models\User;

class ContactInquiryPolicy
{
    public function manageAny(User $user): bool
    {
        return in_array($user->role, [
            'Super Admin',
            'Content Admin',
            'Administrator',
            'Content Editor',
            'HR Manager',
        ], true) || $user->hasRole(['Super Admin', 'Content Admin']);
    }
}
