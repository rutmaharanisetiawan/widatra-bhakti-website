<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;

    protected $primaryKey = 'slug';
    public $incrementing = false;
    protected $keyType = 'string';

    public const CATEGORIES = ['Corporate', 'People', 'Sustainability', 'Events'];

    protected $fillable = [
        'slug', 'cat', 'date', 'published_on', 'read', 'title', 'excerpt', 'img',
        'content', 'gallery', 'tags', 'author', 'author_role', 'status',
    ];

    protected function casts(): array
    {
        return [
            'published_on' => 'date',
            'gallery' => 'array',
            'tags' => 'array',
        ];
    }

    public function getImgUrlAttribute(): ?string
    {
        return MediaAsset::resolveUrl($this->img);
    }
}
