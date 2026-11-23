<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TourBooking extends Model
{
    use HasFactory;

    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    public const STATUSES = ['Pending', 'Reviewed', 'Approved', 'Rejected', 'Completed'];

    protected $fillable = [
        'id', 'user_id', 'tour_date', 'time_slot', 'visitor_name', 'organization',
        'email', 'phone', 'pax', 'purpose', 'status', 'submitted_at',
    ];

    protected function casts(): array
    {
        return [
            'tour_date' => 'date',
            'submitted_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function statusHistory(): HasMany
    {
        return $this->hasMany(TourStatusHistory::class)->orderBy('happened_at');
    }

    public function notes(): HasMany
    {
        return $this->hasMany(TourNote::class)->latest();
    }
}
