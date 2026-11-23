<?php

namespace App\Repositories\Contracts;

use App\Models\Application;
use Illuminate\Database\Eloquent\Collection;

interface ApplicationRepositoryInterface
{
    public function all(): Collection;

    public function forUser(int $userId): Collection;

    public function find(string $id): ?Application;

    public function existsForUserAndJob(int $userId, string $jobSlug): bool;

    public function create(array $data): Application;
}
