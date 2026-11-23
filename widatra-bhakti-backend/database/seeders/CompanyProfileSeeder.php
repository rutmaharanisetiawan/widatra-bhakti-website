<?php

namespace Database\Seeders;

use App\Models\CompanyProfile;
use App\Models\MediaAsset;
use Illuminate\Database\Seeder;

class CompanyProfileSeeder extends Seeder
{
    public function run(): void
    {
        CompanyProfile::updateOrCreate([], [
            'hero_image' => MediaAsset::toRef('seed-hero-cleanroom'),
            'facility_gallery' => [
                MediaAsset::toRef('seed-factory-aerial'),
                MediaAsset::toRef('seed-production-line'),
                MediaAsset::toRef('seed-scientist'),
                MediaAsset::toRef('seed-office-building'),
            ],
            'leadership_photos' => [
                MediaAsset::toRef('seed-team'),
            ],
        ]);
    }
}
