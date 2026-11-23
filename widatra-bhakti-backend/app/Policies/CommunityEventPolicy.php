<?php

namespace App\Policies;

use App\Models\CommunityEvent;
use App\Models\User;

class CommunityEventPolicy
{
    public function manageAny(User $user): bool
    {
        return in_array($user->role, ['Super Admin', 'Administrator', 'Event Moderator', 'HR Manager'], true)
            || $user->hasRole(['Super Admin', 'Event Moderator']);
    }

    public function view(User $user, CommunityEvent $event): bool
    {
        return $this->manageAny($user) || $event->user_id === $user->id;
    }

    /** Only internal employees may submit community events. */
    public function create(User $user): bool
    {
        return $user->isInternal();
    }

    public function update(User $user, CommunityEvent $event): bool
    {
        if ($this->manageAny($user)) {
            return true;
        }

        // The owner may only keep editing while it's still editable by them.
        return $event->user_id === $user->id
            && in_array($event->status, ['Draft', 'Revision Requested'], true);
    }

    public function delete(User $user, CommunityEvent $event): bool
    {
        return $event->user_id === $user->id && $event->status === 'Draft';
    }
}
