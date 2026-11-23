<?php

namespace App\Policies;

use App\Models\TourBooking;
use App\Models\User;

class TourBookingPolicy
{
    public function manageAny(User $user): bool
    {
        return in_array($user->role, ['Super Admin', 'Administrator', 'Factory Tour Admin', 'HR Manager', 'CSR Coordinator'], true)
            || $user->hasRole(['Super Admin', 'Factory Tour Admin']);
    }

    public function view(User $user, TourBooking $booking): bool
    {
        return $this->manageAny($user) || $booking->user_id === $user->id;
    }

    public function update(User $user, TourBooking $booking): bool
    {
        return $this->manageAny($user);
    }
}
