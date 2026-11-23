<?php

namespace App\Repositories\Eloquent;

use App\Models\Application;
use App\Repositories\Contracts\ApplicationRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class ApplicationRepository implements ApplicationRepositoryInterface
{
    public function all(): Collection
    {
        return Application::with(['statusHistory', 'hrNotes', 'interview', 'job'])
            ->orderByDesc('submitted_at')
            ->get();
    }

    public function forUser(int $userId): Collection
    {
        return Application::with(['statusHistory', 'hrNotes', 'interview', 'job'])
            ->where('user_id', $userId)
            ->orderByDesc('submitted_at')
            ->get();
    }

    public function find(string $id): ?Application
    {
        return Application::with(['statusHistory', 'hrNotes', 'interview', 'job', 'user'])->find($id);
    }

    public function existsForUserAndJob(int $userId, string $jobSlug): bool
    {
        return Application::where('user_id', $userId)->where('job_slug', $jobSlug)->exists();
    }

    public function create(array $data): Application
    {
        return Application::create($data);
    }
}
