<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JobPosting extends Model
{
    use HasFactory;

    protected $table = 'job_postings';
    protected $primaryKey = 'slug';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'slug', 'title', 'department', 'location', 'work_mode', 'employment_type',
        'level', 'salary', 'deadline', 'posted', 'summary', 'description',
        'responsibilities', 'qualifications', 'requirements', 'benefits',
        'status', 'featured', 'cover_image',
    ];

    protected function casts(): array
    {
        return [
            'deadline' => 'date',
            'posted' => 'date',
            'responsibilities' => 'array',
            'qualifications' => 'array',
            'requirements' => 'array',
            'benefits' => 'array',
            'featured' => 'boolean',
        ];
    }

    public function applications(): HasMany
    {
        return $this->hasMany(Application::class, 'job_slug', 'slug');
    }

    public function getCoverImageUrlAttribute(): ?string
    {
        return MediaAsset::resolveUrl($this->cover_image);
    }
}
