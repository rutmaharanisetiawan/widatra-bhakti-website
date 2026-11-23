<?php

namespace Database\Seeders;

use App\Models\CsrProgram;
use App\Models\MediaAsset;
use Illuminate\Database\Seeder;

class CsrProgramSeeder extends Seeder
{
    /** Representative subset mirroring csr-data.ts structure/pillars. */
    public function run(): void
    {
        $programs = [
            [
                'slug' => 'free-health-screening-pandaan-villages',
                'pillar' => 'Healthcare', 'location' => 'Pandaan, East Java', 'date' => 'May 14, 2026', 'published_on' => '2026-05-14',
                'title' => 'Free Health Screening for Pandaan Villages',
                'excerpt' => 'Over 800 residents received free health screenings and consultations near our Pandaan facility.',
                'img' => MediaAsset::toRef('seed-csr-community'),
                'content' => 'In partnership with the local Puskesmas, our CSR team organized a free health screening event reaching over 800 residents across four villages surrounding our Pandaan facility, offering blood pressure, blood sugar, and basic consultations at no cost.',
                'gallery' => [MediaAsset::toRef('seed-csr-community')], 'impact' => '800+ residents screened', 'status' => 'Published',
            ],
            [
                'slug' => 'water-conservation-solar-initiative',
                'pillar' => 'Environment', 'location' => 'Pandaan Manufacturing Site', 'date' => 'February 20, 2026', 'published_on' => '2026-02-20',
                'title' => 'Water Conservation & Solar Initiative',
                'excerpt' => 'Our new rainwater harvesting system and rooftop solar array cut plant water and energy use significantly.',
                'img' => MediaAsset::toRef('seed-csr-environment'),
                'content' => 'A newly commissioned rainwater harvesting system now supplies non-process water needs across the Pandaan site, while a 500kWp rooftop solar array covers roughly 15% of daily plant energy demand — part of our broader push toward operational sustainability.',
                'gallery' => [MediaAsset::toRef('seed-csr-environment')], 'impact' => '22% reduction in water usage per unit', 'status' => 'Published',
            ],
            [
                'slug' => 'scholarship-program-pharmacy-students-2026',
                'pillar' => 'Education', 'location' => 'East Java', 'date' => 'January 15, 2026', 'published_on' => '2026-01-15',
                'title' => 'Scholarship Program for Pharmacy Students 2026',
                'excerpt' => 'Ten scholarships awarded to underprivileged pharmacy students across East Java universities.',
                'img' => MediaAsset::toRef('seed-team'),
                'content' => 'This year\'s scholarship cohort supports ten pharmacy students from underprivileged backgrounds across three East Java universities, covering tuition and providing mentorship opportunities within our R&D and QC teams.',
                'gallery' => [], 'impact' => '10 scholarships awarded', 'status' => 'Published',
            ],
            [
                'slug' => 'flood-relief-response-draft',
                'pillar' => 'Community Development', 'location' => 'Pasuruan Regency', 'date' => 'July 20, 2026', 'published_on' => '2026-07-20',
                'title' => 'Flood Relief Response — Pasuruan Regency',
                'excerpt' => 'Draft report on our emergency relief contribution following recent flooding in Pasuruan Regency.',
                'img' => MediaAsset::toRef('seed-csr-community'),
                'content' => 'Report pending final figures — our disaster relief team is coordinating with local authorities on medical supply and volunteer support following the recent flooding in Pasuruan Regency.',
                'gallery' => [], 'impact' => null, 'status' => 'Draft',
            ],
        ];

        foreach ($programs as $p) {
            CsrProgram::create($p);
        }
    }
}
