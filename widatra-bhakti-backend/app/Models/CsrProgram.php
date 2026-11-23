<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CsrProgram extends Model
{
    use HasFactory;

    protected $table = 'csr_programs';
    protected $primaryKey = 'slug';
    public $incrementing = false;
    protected $keyType = 'string';

    public const PILLARS = [
        'Community Development', 'Education', 'Healthcare',
        'Environment', 'Employee Volunteering', 'Disaster Relief',
    ];

    protected $fillable = [
        'slug', 'pillar', 'location', 'date', 'published_on', 'title', 'excerpt',
        'img', 'content', 'gallery', 'impact', 'status',
    ];

    protected function casts(): array
    {
        return [
            'published_on' => 'date',
            'gallery' => 'array',
        ];
    }

    public function getImgUrlAttribute(): ?string
    {
        return MediaAsset::resolveUrl($this->img);
    }
}
