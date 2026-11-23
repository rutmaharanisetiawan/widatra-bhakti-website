<?php

namespace App\Services;

use App\Models\Application;
use App\Models\ApplicationHrNote;
use App\Models\ApplicationStatusHistory;
use App\Models\Interview;
use App\Models\User;
use App\Repositories\Contracts\ApplicationRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class ApplicationService
{
    public function __construct(
        private ApplicationRepositoryInterface $applications,
        private NotificationService $notifications,
    ) {}

    public function all(): Collection
    {
        return $this->applications->all();
    }

    public function forUser(User $user): Collection
    {
        return $this->applications->forUser($user->id);
    }

    public function find(string $id): ?Application
    {
        return $this->applications->find($id);
    }

    /**
     * Submits a new application. Mirrors ats-store.ts addApplication(): the
     * same user may never apply twice to the same job, but different users
     * may freely apply to the same job, and one user may apply to any number
     * of different jobs.
     */
    public function submit(User $user, array $input, UploadedFile $cv): Application
    {
        if ($this->applications->existsForUserAndJob($user->id, $input['job_slug'])) {
            throw ValidationException::withMessages([
                'job_slug' => 'You have already applied for this position. Check My Job Applications for its status.',
            ]);
        }

        $cvPath = $cv->store("applications/{$user->id}", 'public');
        $submittedAt = now();

        $application = $this->applications->create([
            'id' => IdGenerator::make('APP'),
            'user_id' => $user->id,
            'job_slug' => $input['job_slug'],
            'job_title' => $input['job_title'],
            'department' => $input['department'],
            'location' => $input['location'],
            'employment_type' => $input['employment_type'],
            'full_name' => $input['full_name'],
            'dob' => $input['dob'],
            'gender' => $input['gender'],
            'email' => $input['email'],
            'phone' => $input['phone'],
            'address' => $input['address'],
            'city' => $input['city'],
            'education' => $input['education'] ?? [],
            'experience' => $input['experience'] ?? [],
            'has_no_experience' => (bool) ($input['has_no_experience'] ?? false),
            'skills' => $input['skills'] ?? '',
            'linkedin' => $input['linkedin'] ?? null,
            'portfolio' => $input['portfolio'] ?? null,
            'cv_path' => $cvPath,
            'cv_original_name' => $cv->getClientOriginalName(),
            'cv_mime' => $cv->getClientMimeType(),
            'cv_size' => $cv->getSize(),
            'cover_letter' => $input['cover_letter'] ?? null,
            'status' => 'Submitted',
            'submitted_at' => $submittedAt,
        ]);

        ApplicationStatusHistory::create([
            'application_id' => $application->id,
            'status' => 'Submitted',
            'happened_at' => $submittedAt,
        ]);

        $this->notifications->notify(
            $user,
            "Application received — {$application->job_title}",
            'We have received your application and it is now under review.',
            'success',
            "/applicant/applications"
        );

        return $application->fresh(['statusHistory', 'hrNotes', 'interview', 'job']);
    }

    public function updateStatus(Application $application, string $status, ?string $note = null): Application
    {
        $application->update(['status' => $status]);
        ApplicationStatusHistory::create([
            'application_id' => $application->id,
            'status' => $status,
            'note' => $note ?: null,
            'happened_at' => now(),
        ]);

        $this->notifications->notify(
            $application->user,
            "Application update — {$application->job_title}",
            "Your application status changed to \"{$status}\".",
            $status === 'Rejected' ? 'warning' : 'info',
            "/applicant/applications"
        );

        return $application->fresh(['statusHistory', 'hrNotes', 'interview', 'job']);
    }

    /** The only path that transitions an application to "Interview" — timeline entry carries the actual scheduled date/time. */
    public function scheduleInterview(Application $application, array $input): Application
    {
        $interviewAt = $this->composeDateTime($input['date'], $input['time']);

        Interview::updateOrCreate(
            ['application_id' => $application->id],
            [
                'date' => $input['date'],
                'time' => $input['time'],
                'type' => $input['type'],
                'location_or_link' => $input['location_or_link'],
                'interviewer' => $input['interviewer'],
                'notes' => $input['notes'] ?? null,
                'status' => 'Scheduled',
                'scheduled_at' => now(),
            ]
        );

        $application->update(['status' => 'Interview']);
        ApplicationStatusHistory::create([
            'application_id' => $application->id,
            'status' => 'Interview',
            'note' => "Interview scheduled ({$input['type']}) with {$input['interviewer']}.",
            'happened_at' => $interviewAt,
        ]);

        $this->notifications->notify(
            $application->user,
            "Interview scheduled — {$application->job_title}",
            "Your interview is scheduled for {$input['date']} {$input['time']}.",
            'info',
            "/applicant/applications"
        );

        return $application->fresh(['statusHistory', 'hrNotes', 'interview', 'job']);
    }

    public function updateInterview(Application $application, array $input): Application
    {
        $interview = $application->interview;
        if (! $interview) {
            throw ValidationException::withMessages(['interview' => 'No interview has been scheduled for this application yet.']);
        }

        $interviewAt = $this->composeDateTime($input['date'], $input['time']);

        $interview->update([
            'date' => $input['date'],
            'time' => $input['time'],
            'type' => $input['type'],
            'location_or_link' => $input['location_or_link'],
            'interviewer' => $input['interviewer'],
            'notes' => $input['notes'] ?? null,
            'status' => 'Scheduled',
        ]);

        $lastInterviewEntry = $application->statusHistory()->where('status', 'Interview')->orderByDesc('happened_at')->first();
        $note = "Interview rescheduled ({$input['type']}) with {$input['interviewer']}.";
        if ($lastInterviewEntry) {
            $lastInterviewEntry->update(['happened_at' => $interviewAt, 'note' => $note]);
        } else {
            ApplicationStatusHistory::create([
                'application_id' => $application->id,
                'status' => 'Interview',
                'note' => $note,
                'happened_at' => $interviewAt,
            ]);
        }

        return $application->fresh(['statusHistory', 'hrNotes', 'interview', 'job']);
    }

    public function cancelInterview(Application $application, ?string $note = null): Application
    {
        $interview = $application->interview;
        if (! $interview) {
            throw ValidationException::withMessages(['interview' => 'No interview has been scheduled for this application yet.']);
        }

        $interview->update(['status' => 'Cancelled']);
        ApplicationStatusHistory::create([
            'application_id' => $application->id,
            'status' => $application->status,
            'note' => $note ?: 'Interview cancelled by HR.',
            'happened_at' => now(),
        ]);

        return $application->fresh(['statusHistory', 'hrNotes', 'interview', 'job']);
    }

    public function addHrNote(Application $application, string $note, User $author): Application
    {
        ApplicationHrNote::create([
            'application_id' => $application->id,
            'author_id' => $author->id,
            'author_name' => $author->name,
            'note' => $note,
        ]);

        return $application->fresh(['statusHistory', 'hrNotes', 'interview', 'job']);
    }

    public function cvDownloadUrl(Application $application): string
    {
        return Storage::disk('public')->url($application->cv_path);
    }

    private function composeDateTime(string $date, string $time): \Illuminate\Support\Carbon
    {
        try {
            return \Illuminate\Support\Carbon::parse("{$date} {$time}");
        } catch (\Throwable) {
            return now();
        }
    }
}
