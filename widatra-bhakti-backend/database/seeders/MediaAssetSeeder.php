<?php

namespace Database\Seeders;

use App\Models\MediaAsset;
use Illuminate\Database\Seeder;

class MediaAssetSeeder extends Seeder
{
    /**
     * Mirrors media-store.ts SEED_ASSETS exactly (id, folder, type, size).
     * `path` points at storage/app/public/seed/<file> — copy the frontend's
     * src/assets/*.jpg files there (see README) so the URLs resolve; the
     * catalogue rows themselves are what every other seeder's `media:<id>`
     * references depend on.
     */
    public function run(): void
    {
        $assets = [
            ['id' => 'seed-iv-bag', 'name' => 'IV Bag - Bottle.jpg', 'path' => 'seed/iv-bag.jpg', 'folder' => 'Products', 'type' => 'image/jpeg', 'size' => 148000],
            ['id' => 'seed-vial', 'name' => 'Vial.jpg', 'path' => 'seed/vial.jpg', 'folder' => 'Products', 'type' => 'image/jpeg', 'size' => 96000],
            ['id' => 'seed-supplies', 'name' => 'Medical Supplies - Device.jpg', 'path' => 'seed/supplies.jpg', 'folder' => 'Products', 'type' => 'image/jpeg', 'size' => 132000],
            ['id' => 'seed-office-building', 'name' => 'Office Building.jpg', 'path' => 'seed/office-building.jpg', 'folder' => 'Company Profile', 'type' => 'image/jpeg', 'size' => 210000],
            ['id' => 'seed-scientist', 'name' => 'Scientist - Lab.jpg', 'path' => 'seed/scientist.jpg', 'folder' => 'News & Event', 'type' => 'image/jpeg', 'size' => 188000],
            ['id' => 'seed-production-line', 'name' => 'Production Line.jpg', 'path' => 'seed/production-line.jpg', 'folder' => 'Factory Tour', 'type' => 'image/jpeg', 'size' => 204000],
            ['id' => 'seed-csr-community', 'name' => 'CSR Community.jpg', 'path' => 'seed/csr-community.jpg', 'folder' => 'CSR', 'type' => 'image/jpeg', 'size' => 176000],
            ['id' => 'seed-csr-environment', 'name' => 'CSR Environment.jpg', 'path' => 'seed/csr-environment.jpg', 'folder' => 'CSR', 'type' => 'image/jpeg', 'size' => 164000],
            ['id' => 'seed-factory-aerial', 'name' => 'Factory Aerial.jpg', 'path' => 'seed/factory-aerial.jpg', 'folder' => 'Factory Tour', 'type' => 'image/jpeg', 'size' => 224000],
            ['id' => 'seed-team', 'name' => 'Team.jpg', 'path' => 'seed/team.jpg', 'folder' => 'Company Profile', 'type' => 'image/jpeg', 'size' => 192000],
            ['id' => 'seed-hero-cleanroom', 'name' => 'Hero Cleanroom.jpg', 'path' => 'seed/hero-cleanroom.jpg', 'folder' => 'Gallery', 'type' => 'image/jpeg', 'size' => 236000],
            ['id' => 'seed-dark-factory', 'name' => 'Dark Factory.jpg', 'path' => 'seed/dark-factory.jpg', 'folder' => 'Factory Tour', 'type' => 'image/jpeg', 'size' => 198000],
        ];

        foreach ($assets as $asset) {
            MediaAsset::create($asset);
        }
    }
}
