<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\JobPosting */
class JobPostingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'slug' => $this->slug,
            'title' => $this->title,
            'department' => $this->department,
            'location' => $this->location,
            'work_mode' => $this->work_mode,
            'employment_type' => $this->employment_type,
            'level' => $this->level,
            'salary' => $this->salary,
            'deadline' => $this->deadline?->toDateString(),
            'posted' => $this->posted?->toDateString(),
            'summary' => $this->summary,
            'description' => $this->description,
            'responsibilities' => $this->responsibilities,
            'qualifications' => $this->qualifications,
            'requirements' => $this->requirements,
            'benefits' => $this->benefits,
            'status' => $this->status,
            'featured' => $this->featured,
            'cover_image' => $this->cover_image,
            'cover_image_url' => $this->cover_image_url,
        ];
    }
}
