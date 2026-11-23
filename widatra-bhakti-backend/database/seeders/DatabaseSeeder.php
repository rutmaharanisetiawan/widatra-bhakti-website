<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            MediaAssetSeeder::class,
            JobPostingSeeder::class,
            ApplicationSeeder::class,
            TourBookingSeeder::class,
            ArticleSeeder::class,
            ProductSeeder::class,
            CsrProgramSeeder::class,
            ContactInquirySeeder::class,
            CompanyProfileSeeder::class,
            FactoryTourContentSeeder::class,
        ]);
    }
}
