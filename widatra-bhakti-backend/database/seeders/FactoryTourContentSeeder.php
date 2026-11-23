<?php

namespace Database\Seeders;

use App\Models\FactoryTourContent;
use App\Models\MediaAsset;
use Illuminate\Database\Seeder;

class FactoryTourContentSeeder extends Seeder
{
    public function run(): void
    {
        FactoryTourContent::updateOrCreate([], [
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
