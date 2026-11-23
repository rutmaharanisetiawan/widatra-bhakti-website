<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\MediaAsset;
use Illuminate\Database\Seeder;

class ArticleSeeder extends Seeder
{
    /** Representative subset mirroring news-data.ts structure/categories. */
    public function run(): void
    {
        $articles = [
            [
                'slug' => 'widatra-bhakti-completes-pic-s-gmp-recertification',
                'cat' => 'Corporate', 'date' => 'June 18, 2026', 'published_on' => '2026-06-18', 'read' => '3 min read',
                'title' => 'WIDATRA Bhakti Completes PIC/S GMP Recertification',
                'excerpt' => 'Our Pandaan facility has successfully passed its triennial PIC/S GMP recertification audit with zero critical findings.',
                'img' => MediaAsset::toRef('seed-production-line'),
                'content' => "Our Pandaan manufacturing facility has successfully completed its triennial PIC/S GMP recertification audit, conducted by Indonesia's National Agency of Drug and Food Control (BPOM). The audit covered all sterile production lines, quality control laboratories, and warehouse operations, resulting in zero critical findings.\n\nThis recertification reaffirms our unwavering commitment to manufacturing excellence and product safety for the millions of patients who rely on our intravenous and irrigation solutions every year.",
                'gallery' => [MediaAsset::toRef('seed-production-line'), MediaAsset::toRef('seed-factory-aerial')],
                'tags' => ['GMP', 'Quality', 'Certification'],
                'author' => 'Corporate Communications', 'author_role' => 'Corporate', 'status' => 'Published',
            ],
            [
                'slug' => 'meet-our-2026-apoteker-trainee-cohort',
                'cat' => 'People', 'date' => 'May 22, 2026', 'published_on' => '2026-05-22', 'read' => '2 min read',
                'title' => 'Meet Our 2026 Apoteker Trainee Cohort',
                'excerpt' => 'Twelve newly licensed pharmacists have joined WIDATRA Bhakti through our structured 12-month apoteker development program.',
                'img' => MediaAsset::toRef('seed-team'),
                'content' => 'Twelve newly licensed pharmacists have joined WIDATRA Bhakti through our structured 12-month apoteker development program, rotating across Production, QA, QC, and Regulatory Affairs before settling into a permanent placement.',
                'gallery' => [MediaAsset::toRef('seed-team')],
                'tags' => ['Careers', 'People Development'],
                'author' => 'Human Resources', 'author_role' => 'People', 'status' => 'Published',
            ],
            [
                'slug' => 'expanding-cold-chain-distribution-to-eastern-indonesia',
                'cat' => 'Corporate', 'date' => 'April 10, 2026', 'published_on' => '2026-04-10', 'read' => '4 min read',
                'title' => 'Expanding Cold Chain Distribution to Eastern Indonesia',
                'excerpt' => 'A new distribution hub in Makassar extends reliable access to our sterile products across Sulawesi, Maluku, and Papua.',
                'img' => MediaAsset::toRef('seed-office-building'),
                'content' => 'Our new distribution hub in Makassar significantly shortens delivery times and strengthens cold-chain integrity for hospitals across Sulawesi, Maluku, and Papua — a region historically underserved by centralized Java-based logistics.',
                'gallery' => [], 'tags' => ['Supply Chain', 'Expansion'],
                'author' => 'Corporate Communications', 'author_role' => 'Corporate', 'status' => 'Published',
            ],
            [
                'slug' => 'sustainability-report-2025-highlights',
                'cat' => 'Sustainability', 'date' => 'March 02, 2026', 'published_on' => '2026-03-02', 'read' => '5 min read',
                'title' => 'Sustainability Report 2025: Highlights',
                'excerpt' => 'Our 2025 sustainability report highlights a 22% reduction in water usage per unit produced and expanded community health programs.',
                'img' => MediaAsset::toRef('seed-csr-environment'),
                'content' => 'Our 2025 Sustainability Report details a 22% year-on-year reduction in water usage per unit produced, a new solar array covering 15% of plant energy needs, and the expansion of our community health screening program to six additional villages.',
                'gallery' => [MediaAsset::toRef('seed-csr-environment')], 'tags' => ['Sustainability', 'ESG'],
                'author' => 'Corporate Communications', 'author_role' => 'Sustainability', 'status' => 'Published',
            ],
            [
                'slug' => 'draft-upcoming-hospital-partnership-summit',
                'cat' => 'Events', 'date' => 'July 25, 2026', 'published_on' => '2026-07-25', 'read' => '2 min read',
                'title' => 'Upcoming Hospital Partnership Summit 2026',
                'excerpt' => 'Save the date — our annual Hospital Partnership Summit returns this September in Jakarta.',
                'img' => MediaAsset::toRef('seed-office-building'),
                'content' => 'Details to be finalized before publishing — save the date for our annual Hospital Partnership Summit, returning this September in Jakarta.',
                'gallery' => [], 'tags' => ['Events'],
                'author' => 'Corporate Communications', 'author_role' => 'Events', 'status' => 'Draft',
            ],
        ];

        foreach ($articles as $a) {
            Article::create($a);
        }
    }
}
