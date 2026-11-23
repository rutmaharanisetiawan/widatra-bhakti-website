<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    protected string $guard_name = 'sanctum';

    protected $fillable = [
        'public_id', 'account_type', 'role', 'status', 'name', 'email', 'phone',
        'password', 'employee_id', 'department', 'position',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // ------------------------------------------------------------------
    // Role / access-control helpers
    // ------------------------------------------------------------------

    public const ADMIN_ROLES = [
        'Super Admin',
        'Content Admin',
        'HR Manager',
        'Event Moderator',
        'Factory Tour Admin',
        'Administrator',
        'Content Editor',
        'CSR Coordinator',
    ];

    public function isAdminRole(): bool
    {
        return in_array($this->role, self::ADMIN_ROLES, true);
    }

    public function isInternal(): bool
    {
        return $this->account_type === 'internal';
    }

    public function isExternal(): bool
    {
        return $this->account_type === 'external';
    }

    public function isAdministrator(): bool
    {
        return in_array($this->role, ['Super Admin', 'Administrator'], true);
    }

    public function isActive(): bool
    {
        return $this->status === 'Active';
    }

    // ------------------------------------------------------------------
    // Relationships
    // ------------------------------------------------------------------

    public function applications(): HasMany
    {
        return $this->hasMany(Application::class);
    }

    public function tourBookings(): HasMany
    {
        return $this->hasMany(TourBooking::class);
    }

    public function communityEvents(): HasMany
    {
        return $this->hasMany(CommunityEvent::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class);
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class)->latest();
    }
}
