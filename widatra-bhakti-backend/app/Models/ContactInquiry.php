<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ContactInquiry extends Model
{
    use HasFactory;

    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id', 'name', 'organization', 'email', 'phone', 'subject', 'message',
        'source', 'received_at', 'read', 'archived',
    ];

    protected function casts(): array
    {
        return [
            'received_at' => 'datetime',
            'read' => 'boolean',
            'archived' => 'boolean',
        ];
    }

    public function replies(): HasMany
    {
        return $this->hasMany(ContactReply::class)->orderBy('sent_at');
    }

    /** Derived, display-only status — mirrors contact-data.ts getContactStatus(). */
    public function getDerivedStatusAttribute(): string
    {
        if ($this->archived) {
            return 'Archived';
        }
        if ($this->replies()->exists()) {
            return 'Replied';
        }
        if ($this->read) {
            return 'Read';
        }

        return 'Unread';
    }
}
