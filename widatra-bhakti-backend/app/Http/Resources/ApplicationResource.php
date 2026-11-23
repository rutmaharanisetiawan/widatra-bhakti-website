<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

/** @mixin \App\Models\Application */
class ApplicationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user->public_id ?? null,
            'job_slug' => $this->job_slug,
            'job_title' => $this->job_title,
            'department' => $this->department,
            'location' => $this->location,
            'employment_type' => $this->employment_type,
            'full_name' => $this->full_name,
            'dob' => $this->dob?->toDateString(),
            'gender' => $this->gender,
            'email' => $this->email,
            'phone' => $this->phone,
            'address' => $this->address,
            'city' => $this->city,
            'education' => $this->education,
            'experience' => $this->experience,
            'has_no_experience' => $this->has_no_experience,
            'skills' => $this->skills,
            'linkedin' => $this->linkedin,
            'portfolio' => $this->portfolio,
            'cv_file_name' => $this->cv_original_name,
            'cv_file_type' => $this->cv_mime,
            'cv_file_size' => $this->cv_size,
            'cv_url' => Storage::disk('public')->url($this->cv_path),
            'cover_letter' => $this->cover_letter,
            'status' => $this->status,
            'status_history' => $this->statusHistory->map(fn ($h) => [
                'status' => $h->status,
                'date' => $h->happened_at?->toIso8601String(),
                'note' => $h->note,
            ]),
            'hr_notes' => $this->hrNotes->map(fn ($n) => [
                'id' => (string) $n->id,
                'author' => $n->author_name,
                'note' => $n->note,
                'date' => $n->created_at?->toIso8601String(),
            ]),
            'interview' => $this->interview ? new InterviewResource($this->interview) : null,
            'submitted_at' => $this->submitted_at?->toIso8601String(),
        ];
    }
}
