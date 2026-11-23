<?php

namespace App\Services;

use App\Models\JobPosting;
use App\Repositories\Contracts\JobPostingRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class JobPostingService
{
    public function __construct(private JobPostingRepositoryInterface $jobs) {}

    public function all(): Collection
    {
        return $this->jobs->all();
    }

    public function published(): Collection
    {
        return $this->jobs->published();
    }

    public function find(string $slug): ?JobPosting
    {
        return $this->jobs->findBySlug($slug);
    }

    public function findPublished(string $slug): ?JobPosting
    {
        return $this->jobs->findPublishedBySlug($slug);
    }

    public function create(array $data): JobPosting
    {
        $data['slug'] = ! empty($data['slug'])
            ? $data['slug']
            : SlugGenerator::unique($data['title'], fn ($s) => $this->jobs->slugExists($s), 'job');

        return $this->jobs->create($data);
    }

    public function update(JobPosting $job, array $data): JobPosting
    {
        return $this->jobs->update($job, $data);
    }

    public function delete(JobPosting $job): void
    {
        $this->jobs->delete($job);
    }

    public function setStatus(JobPosting $job, string $status): JobPosting
    {
        return $this->jobs->update($job, ['status' => $status]);
    }

    public function setFeatured(JobPosting $job, bool $featured): JobPosting
    {
        return $this->jobs->update($job, ['featured' => $featured]);
    }
}
