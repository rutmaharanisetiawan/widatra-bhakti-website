<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanyProfile extends Model
{
    protected $table = 'company_profile';

    protected $fillable = ['hero_image', 'facility_gallery', 'leadership_photos'];

    protected function casts(): array
    {
        return [
            'facility_gallery' => 'array',
            'leadership_photos' => 'array',
        ];
    }

    /** There is only ever one row — fetch it (creating a default if missing). */
    public static function current(): self
    {
        return self::query()->firstOrCreate([], [
            'hero_image' => MediaAsset::toRef('seed-hero-cleanroom'),
            'facility_gallery' => [
                MediaAsset::toRef('seed-factory-aerial'),
                MediaAsset::toRef('seed-production-line'),
                MediaAsset::toRef('seed-scientist'),
            ],
            'leadership_photos' => [],
        ]);
    }
}
