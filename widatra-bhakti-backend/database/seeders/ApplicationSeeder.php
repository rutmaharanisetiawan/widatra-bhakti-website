<?php

namespace Database\Seeders;

use App\Models\Application;
use App\Models\ApplicationStatusHistory;
use App\Models\Interview;
use App\Models\User;
use App\Services\IdGenerator;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class ApplicationSeeder extends Seeder
{
    /** Mirrors ats-store.ts seed applications for demo applicant Ayu Pratiwi. */
    public function run(): void
    {
        $applicant = User::where('email', 'ayu.pratiwi@example.com')->first();
        if (! $applicant) {
            return;
        }

        // Ensure a placeholder CV exists in storage for the seeded application.
        $cvPath = 'applications/seed/ayu-pratiwi-cv.pdf';
        if (! Storage::disk('public')->exists($cvPath)) {
            Storage::disk('public')->put($cvPath, "%PDF-1.4\n% Placeholder seed CV file.\n");
        }

        $seedApplications = [
            [
                'job_slug' => 'quality-control-analyst', 'job_title' => 'Quality Control Analyst',
                'department' => 'Quality', 'location' => 'Pandaan, East Java', 'employment_type' => 'Full-time',
                'status' => 'Interview', 'days_ago' => 9,
                'interview' => ['date' => now()->addDays(3)->toDateString(), 'time' => '10:00', 'type' => 'Offline', 'location_or_link' => 'WIDATRA Pandaan Plant — HR Building, Room 2', 'interviewer' => 'Sari Ningsih (HR Manager)', 'notes' => 'Bring original diploma & transcript.'],
            ],
            [
                'job_slug' => 'ra-officer', 'job_title' => 'Regulatory Affairs Officer',
                'department' => 'Corporate', 'location' => 'Jakarta HQ', 'employment_type' => 'Full-time',
                'status' => 'Screening', 'days_ago' => 4, 'interview' => null,
            ],
            [
                'job_slug' => 'supply-planner', 'job_title' => 'Supply Chain Planner',
                'department' => 'Supply Chain', 'location' => 'Jakarta HQ', 'employment_type' => 'Full-time',
                'status' => 'Submitted', 'days_ago' => 1, 'interview' => null,
            ],
        ];

        foreach ($seedApplications as $seed) {
            $submittedAt = now()->subDays($seed['days_ago']);

            $application = Application::create([
                'id' => IdGenerator::make('APP'),
                'user_id' => $applicant->id,
                'job_slug' => $seed['job_slug'],
                'job_title' => $seed['job_title'],
                'department' => $seed['department'],
                'location' => $seed['location'],
                'employment_type' => $seed['employment_type'],
                'full_name' => 'Ayu Pratiwi',
                'dob' => '1998-04-12',
                'gender' => 'Female',
                'email' => $applicant->email,
                'phone' => $applicant->phone,
                'address' => 'Jl. Merdeka No. 45',
                'city' => 'Surabaya',
                'education' => [[
                    'degree' => 'S1', 'major' => 'Pharmacy', 'institution' => 'Universitas Airlangga', 'year' => '2021',
                ]],
                'experience' => [[
                    'company' => 'PT Kimia Sehat Farma', 'role' => 'QC Analyst', 'period' => '2021 - 2025',
                    'description' => 'Routine physico-chemical and microbiological testing of injectable products.',
                ]],
                'has_no_experience' => false,
                'skills' => 'HPLC, UV-Vis, GMP documentation, Microsoft Excel',
                'linkedin' => 'https://linkedin.com/in/ayupratiwi',
                'portfolio' => null,
                'cv_path' => $cvPath,
                'cv_original_name' => 'Ayu_Pratiwi_CV.pdf',
                'cv_mime' => 'application/pdf',
                'cv_size' => Storage::disk('public')->size($cvPath),
                'cover_letter' => 'I am excited to apply my analytical background to support WIDATRA\'s quality mission.',
                'status' => $seed['status'],
                'submitted_at' => $submittedAt,
            ]);

            ApplicationStatusHistory::create(['application_id' => $application->id, 'status' => 'Submitted', 'happened_at' => $submittedAt]);

            if (in_array($seed['status'], ['Screening', 'Interview'], true)) {
                ApplicationStatusHistory::create(['application_id' => $application->id, 'status' => 'Screening', 'happened_at' => $submittedAt->copy()->addDay()]);
            }

            if ($seed['interview']) {
                $interview = $seed['interview'];
                Interview::create([
                    'application_id' => $application->id,
                    'date' => $interview['date'],
                    'time' => $interview['time'],
                    'type' => $interview['type'],
                    'location_or_link' => $interview['location_or_link'],
                    'interviewer' => $interview['interviewer'],
                    'notes' => $interview['notes'],
                    'status' => 'Scheduled',
                    'scheduled_at' => $submittedAt->copy()->addDays(2),
                ]);
                ApplicationStatusHistory::create([
                    'application_id' => $application->id,
                    'status' => 'Interview',
                    'note' => "Interview scheduled ({$interview['type']}) with {$interview['interviewer']}.",
                    'happened_at' => \Illuminate\Support\Carbon::parse("{$interview['date']} {$interview['time']}"),
                ]);
            }
        }
    }
}
