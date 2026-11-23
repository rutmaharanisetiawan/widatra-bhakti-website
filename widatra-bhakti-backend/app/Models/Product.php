<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $primaryKey = 'code';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'code', 'name', 'category', 'brand', 'osmolarity', 'calorie', 'nie',
        'packaging', 'sizes', 'indication', 'benefits', 'applications',
        'storage', 'shelf_life', 'composition', 'manufacturing_note', 'img', 'tagline',
    ];

    protected function casts(): array
    {
        return [
            'packaging' => 'array',
            'sizes' => 'array',
            'benefits' => 'array',
            'applications' => 'array',
        ];
    }

    public function getImgUrlAttribute(): ?string
    {
        return MediaAsset::resolveUrl($this->img);
    }
}
