<?php

namespace Database\Seeders;

use App\Models\JobPosting;
use App\Models\MediaAsset;
use Illuminate\Database\Seeder;

class JobPostingSeeder extends Seeder
{
    /** Mirrors jobs-data.ts JOBS exactly. */
    public function run(): void
    {
        $jobs = [
            [
                'slug' => 'production-supervisor-sterile', 'title' => 'Production Supervisor — Sterile Filling',
                'department' => 'Production', 'location' => 'Pandaan, East Java', 'work_mode' => 'On-site',
                'employment_type' => 'Full-time', 'level' => 'Mid', 'deadline' => '2026-08-31', 'posted' => '2026-06-15',
                'summary' => 'Lead a shift on our Grade A closed-system filling lines, ensuring every batch meets PIC/S GMP standards.',
                'description' => 'You will manage daily filling operations for large-volume parenterals, supervise a team of 12 operators, and partner with QA to deliver sterile product with zero deviation.',
                'responsibilities' => ['Supervise sterile filling line per batch record and SOP', 'Coordinate with QA, QC and Engineering on line clearance and changeover', 'Conduct shift handover, deviation investigation, and CAPA execution', 'Train operators on aseptic technique and gowning qualification', 'Drive line OEE, yield, and right-first-time KPIs'],
                'qualifications' => ['S1 in Pharmacy, Pharmaceutical Engineering or related', 'Minimum 4 years in sterile manufacturing', 'Apoteker license preferred'],
                'requirements' => ['Hands-on knowledge of cGMP, PIC/S, and Annex 1', 'Experience with deviation, change control, and risk assessment tools', 'Willing to work in rotating shift system'],
                'benefits' => ['Competitive base + shift allowance', 'BPJS Kesehatan & Ketenagakerjaan', 'Annual performance bonus', 'Health & dental coverage for family', 'Continuous GMP training'],
                'status' => 'Published', 'featured' => true, 'cover_image' => MediaAsset::toRef('seed-production-line'),
            ],
            [
                'slug' => 'quality-control-analyst', 'title' => 'Quality Control Analyst',
                'department' => 'Quality', 'location' => 'Pandaan, East Java', 'work_mode' => 'On-site',
                'employment_type' => 'Full-time', 'level' => 'Entry', 'deadline' => '2026-07-30', 'posted' => '2026-05-20',
                'summary' => 'Run physico-chemical and microbiological testing of raw materials, in-process and finished products.',
                'description' => 'Join a 30-person QC team operating a fully equipped analytical and microbiology lab supporting our parenteral portfolio.',
                'responsibilities' => ['Perform HPLC, UV-Vis, titration, pH, osmolality testing', 'Conduct bioburden, endotoxin (LAL), and sterility testing', 'Document results per ALCOA+ data-integrity principles', 'Maintain instrument calibration and qualification'],
                'qualifications' => ['S1 Pharmacy / Chemistry / Biology', 'Fresh graduates encouraged'],
                'requirements' => ['Strong attention to detail', 'English communication (read & write)', 'Willing to relocate to Pandaan'],
                'benefits' => ['BPJS Kesehatan & Ketenagakerjaan', 'Meal & transport allowance', 'Career path into Senior Analyst / Supervisor', 'Internal apoteker certification support'],
                'status' => 'Published', 'featured' => false, 'cover_image' => MediaAsset::toRef('seed-scientist'),
            ],
            [
                'slug' => 'ra-officer', 'title' => 'Regulatory Affairs Officer',
                'department' => 'Corporate', 'location' => 'Jakarta HQ', 'work_mode' => 'Hybrid',
                'employment_type' => 'Full-time', 'level' => 'Mid', 'deadline' => '2026-08-15', 'posted' => '2026-06-01',
                'summary' => 'Manage product registrations, variations, and renewals with BPOM and ASEAN regulators.',
                'description' => 'Own the full life-cycle dossier for assigned products and serve as our trusted liaison with regulatory bodies across the region.',
                'responsibilities' => ['Compile CTD dossiers for new registrations and variations', 'Track regulatory timelines and ensure on-time submissions', 'Liaise with BPOM and ASEAN NRAs', 'Monitor regulatory intelligence and impact on portfolio'],
                'qualifications' => ['Apoteker with 3+ years RA experience', 'Familiar with ASEAN ACTD/ACTR'],
                'requirements' => ['Excellent English written communication', 'Strong dossier and project skills'],
                'benefits' => ['Hybrid Jakarta arrangement', 'International training opportunity', 'Performance bonus'],
                'status' => 'Published', 'featured' => false, 'cover_image' => MediaAsset::toRef('seed-office-building'),
            ],
            [
                'slug' => 'rd-formulation-scientist', 'title' => 'R&D Formulation Scientist',
                'department' => 'R&D', 'location' => 'Pandaan, East Java', 'work_mode' => 'On-site',
                'employment_type' => 'Full-time', 'level' => 'Senior', 'deadline' => '2026-09-30', 'posted' => '2026-06-05',
                'summary' => 'Develop next-generation sterile formulations and packaging systems for our Indonesian and export markets.',
                'description' => 'Lead bench-to-pilot formulation development with cross-functional support from QA, RA, and Engineering.',
                'responsibilities' => ['Design and execute formulation experiments (DoE)', 'Develop stability protocols and interpret data', 'Author development reports and tech transfer dossiers', 'Lead pilot-scale trials and scale-up to commercial'],
                'qualifications' => ['S2 Pharmaceutics or Pharmaceutical Technology preferred', '5+ years in sterile R&D'],
                'requirements' => ['Strong analytical & statistical skills', 'Experience with terminal sterilization'],
                'benefits' => ['Senior-band compensation', 'Patent royalty program', 'International conference budget'],
                'status' => 'Published', 'featured' => true, 'cover_image' => MediaAsset::toRef('seed-scientist'),
            ],
            [
                'slug' => 'maintenance-engineer', 'title' => 'Maintenance Engineer — Utilities & WFI',
                'department' => 'Engineering', 'location' => 'Pandaan, East Java', 'work_mode' => 'On-site',
                'employment_type' => 'Full-time', 'level' => 'Mid', 'deadline' => '2026-08-30', 'posted' => '2026-06-10',
                'summary' => 'Keep our Water-for-Injection, clean steam and HVAC systems running at pharmaceutical-grade reliability.',
                'description' => 'Own preventive and predictive maintenance for critical utilities supporting our parenteral lines.',
                'responsibilities' => ['Execute PM schedules for WFI, clean steam, HVAC, compressed air', 'Lead utility qualification (IQ/OQ/PQ) revalidation', 'Troubleshoot deviations and lead root-cause analysis'],
                'qualifications' => ['S1 Mechanical / Electrical Engineering', '3+ years in pharma utilities'],
                'requirements' => ['Working knowledge of GAMP 5 and PIC/S Annex 1', 'Available on-call for utility incidents'],
                'benefits' => ['Standby allowance', 'BPJS + family insurance', 'Annual technical training abroad'],
                'status' => 'Published', 'featured' => false, 'cover_image' => MediaAsset::toRef('seed-factory-aerial'),
            ],
            [
                'slug' => 'supply-planner', 'title' => 'Supply Chain Planner',
                'department' => 'Supply Chain', 'location' => 'Jakarta HQ', 'work_mode' => 'Hybrid',
                'employment_type' => 'Full-time', 'level' => 'Mid', 'deadline' => '2026-07-31', 'posted' => '2026-06-01',
                'summary' => 'Balance demand, production capacity, and inventory across our hospital and distributor channels.',
                'description' => 'Drive S&OP cycle and ensure 98%+ service level for critical infusion products.',
                'responsibilities' => ['Run monthly S&OP with Sales, Production, Finance', 'Maintain MPS and MRP accuracy in ERP', 'Manage finished-goods inventory KPI'],
                'qualifications' => ['S1 Industrial Engineering / Business', 'APICS / CPIM preferred'],
                'requirements' => ['SAP MM/PP experience', 'Strong Excel & analytical skills'],
                'benefits' => ['Hybrid work', 'Performance bonus', 'Training subsidy'],
                'status' => 'Published', 'featured' => false, 'cover_image' => MediaAsset::toRef('seed-office-building'),
            ],
            [
                'slug' => 'sales-representative-east', 'title' => 'Hospital Sales Representative — East Indonesia',
                'department' => 'Sales & Marketing', 'location' => 'Jakarta HQ', 'work_mode' => 'On-site',
                'employment_type' => 'Full-time', 'level' => 'Mid', 'deadline' => '2026-09-15', 'posted' => '2026-06-12',
                'summary' => 'Represent the WIDATRA portfolio across hospitals in Sulawesi, Maluku, and Papua.',
                'description' => 'Build long-term clinical partnerships with hospital pharmacies and procurement teams.',
                'responsibilities' => ['Achieve regional sales target', 'Manage distributor relationships', 'Lead clinical detailing with HCPs'],
                'qualifications' => ['S1 any field, Pharmacy preferred', '3+ years pharmaceutical sales'],
                'requirements' => ['Willing to travel 60% of time', 'Strong network in target region'],
                'benefits' => ['Sales incentive scheme', 'Company car allowance', 'BPJS + private health'],
                'status' => 'Published', 'featured' => false, 'cover_image' => MediaAsset::toRef('seed-team'),
            ],
            [
                'slug' => 'internship-qc', 'title' => 'Internship — Quality Control Laboratory',
                'department' => 'Quality', 'location' => 'Pandaan, East Java', 'work_mode' => 'On-site',
                'employment_type' => 'Internship', 'level' => 'Entry', 'deadline' => '2026-06-30', 'posted' => '2026-05-01',
                'summary' => '6-month internship program in our QC lab for final-year pharmacy and chemistry students.',
                'description' => 'Get hands-on experience in a real pharmaceutical QC environment under senior analyst mentorship.',
                'responsibilities' => ['Shadow QC analysts on routine testing', 'Support documentation and trend reporting', 'Complete a final intern project'],
                'qualifications' => ['Final-semester S1 student in Pharmacy / Chemistry / Biology'],
                'requirements' => ['Recommendation letter from university', 'Available 6 months on-site'],
                'benefits' => ['Monthly stipend', 'Dormitory option', 'Certificate & potential conversion to full-time'],
                'status' => 'Draft', 'featured' => false, 'cover_image' => MediaAsset::toRef('seed-scientist'),
            ],
        ];

        foreach ($jobs as $job) {
            JobPosting::create($job);
        }
    }
}
