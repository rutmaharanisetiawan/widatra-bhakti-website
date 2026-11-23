<?php

namespace App\Repositories\Contracts;

use App\Models\JobPosting;
use Illuminate\Database\Eloquent\Collection;

interface JobPostingRepositoryInterface
{
    public function all(): Collection;

    public function published(): Collection;

    public function findBySlug(string $slug): ?JobPosting;

    public function findPublishedBySlug(string $slug): ?JobPosting;

    public function slugExists(string $slug): bool;

    public function create(array $data): JobPosting;

    public function update(JobPosting $job, array $data): JobPosting;

    public function delete(JobPosting $job): void;
}
