<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CommunityEvent extends Model
{
    use HasFactory;

    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    public const STATUSES = ['Draft', 'Pending', 'Revision Requested', 'Approved', 'Rejected', 'Published'];

    public const ADMIN_VISIBLE_STATUSES = ['Pending', 'Revision Requested', 'Approved', 'Rejected', 'Published'];

    public const COMMUNITY_OPTIONS = [
        'Sports', 'Basketball', 'House', 'Volleyball', 'Badminton',
        'Music & Arts', 'Employee Club', 'Others',
    ];

    public const CATEGORIES = ['Tournament', 'Workshop', 'Celebration', 'Competition', 'Gathering', 'Charity', 'Other'];

    protected $fillable = [
        'id', 'user_id', 'submitter_name', 'submitter_email', 'title', 'community',
        'category', 'event_date', 'location', 'summary', 'description', 'cover_image',
        'gallery', 'tags', 'contact_person', 'contact_phone', 'agreement_accepted',
        'status', 'submitted_at', 'published_article_slug',
    ];

    protected function casts(): array
    {
        return [
            'event_date' => 'date',
            'gallery' => 'array',
            'tags' => 'array',
            'agreement_accepted' => 'boolean',
            'submitted_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(CommunityEventDocument::class);
    }

    public function statusHistory(): HasMany
    {
        return $this->hasMany(CommunityEventStatusHistory::class)->orderBy('happened_at');
    }

    public function adminNotes(): HasMany
    {
        return $this->hasMany(CommunityEventNote::class)->latest();
    }

    public function publishedArticle(): BelongsTo
    {
        return $this->belongsTo(Article::class, 'published_article_slug', 'slug');
    }

    public function getCoverImageUrlAttribute(): ?string
    {
        return MediaAsset::resolveUrl($this->cover_image);
    }
}
