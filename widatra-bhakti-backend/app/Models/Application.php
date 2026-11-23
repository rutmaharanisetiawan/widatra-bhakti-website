<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Application extends Model
{
    use HasFactory;

    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    public const STATUSES = ['Submitted', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'];

    protected $fillable = [
        'id', 'user_id', 'job_slug', 'job_title', 'department', 'location', 'employment_type',
        'full_name', 'dob', 'gender', 'email', 'phone', 'address', 'city',
        'education', 'experience', 'has_no_experience', 'skills',
        'linkedin', 'portfolio',
        'cv_path', 'cv_original_name', 'cv_mime', 'cv_size', 'cover_letter',
        'status', 'submitted_at',
    ];

    protected function casts(): array
    {
        return [
            'dob' => 'date',
            'education' => 'array',
            'experience' => 'array',
            'has_no_experience' => 'boolean',
            'submitted_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function job(): BelongsTo
    {
        return $this->belongsTo(JobPosting::class, 'job_slug', 'slug');
    }

    public function statusHistory(): HasMany
    {
        return $this->hasMany(ApplicationStatusHistory::class)->orderBy('happened_at');
    }

    public function hrNotes(): HasMany
    {
        return $this->hasMany(ApplicationHrNote::class)->latest();
    }

    public function interview(): HasOne
    {
        return $this->hasOne(Interview::class);
    }
}
