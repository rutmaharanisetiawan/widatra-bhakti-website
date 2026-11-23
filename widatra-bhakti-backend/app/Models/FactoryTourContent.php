<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FactoryTourContent extends Model
{
    protected $table = 'factory_tour_content';

    protected $fillable = ['hero_image', 'gallery'];

    protected function casts(): array
    {
        return ['gallery' => 'array'];
    }

    /** There is only ever one row — fetch it (creating a default if missing). */
    public static function current(): self
    {
        return self::query()->firstOrCreate([], [
            'hero_image' => MediaAsset::toRef('seed-dark-factory'),
            'gallery' => [
                MediaAsset::toRef('seed-factory-aerial'),
                MediaAsset::toRef('seed-production-line'),
                MediaAsset::toRef('seed-scientist'),
                MediaAsset::toRef('seed-office-building'),
                MediaAsset::toRef('seed-team'),
                MediaAsset::toRef('seed-dark-factory'),
            ],
        ]);
    }
}
