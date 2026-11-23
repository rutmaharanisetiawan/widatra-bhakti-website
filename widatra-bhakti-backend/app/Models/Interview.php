<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Interview extends Model
{
    protected $fillable = [
        'application_id', 'date', 'time', 'type', 'location_or_link',
        'interviewer', 'notes', 'status', 'scheduled_at',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'scheduled_at' => 'datetime',
        ];
    }

    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class);
    }
}
