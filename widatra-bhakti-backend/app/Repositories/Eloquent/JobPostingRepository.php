<?php

namespace App\Repositories\Eloquent;

use App\Models\JobPosting;
use App\Repositories\Contracts\JobPostingRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class JobPostingRepository implements JobPostingRepositoryInterface
{
    public function all(): Collection
    {
        return JobPosting::orderByDesc('posted')->get();
    }

    public function published(): Collection
    {
        return JobPosting::where('status', 'Published')->orderByDesc('posted')->get();
    }

    public function findBySlug(string $slug): ?JobPosting
    {
        return JobPosting::find($slug);
    }

    public function findPublishedBySlug(string $slug): ?JobPosting
    {
        return JobPosting::where('slug', $slug)->where('status', 'Published')->first();
    }

    public function slugExists(string $slug): bool
    {
        return JobPosting::whereKey($slug)->exists();
    }

    public function create(array $data): JobPosting
    {
        return JobPosting::create($data);
    }

    public function update(JobPosting $job, array $data): JobPosting
    {
        $job->update($data);

        return $job->refresh();
    }

    public function delete(JobPosting $job): void
    {
        $job->delete();
    }
}
