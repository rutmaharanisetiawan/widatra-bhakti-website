<?php

namespace App\Repositories\Contracts;

use App\Models\CommunityEvent;
use Illuminate\Database\Eloquent\Collection;

interface CommunityEventRepositoryInterface
{
    public function all(): Collection;

    public function adminQueue(): Collection;

    public function forUser(int $userId): Collection;

    public function find(string $id): ?CommunityEvent;

    public function create(array $data): CommunityEvent;

    public function update(CommunityEvent $event, array $data): CommunityEvent;

    public function delete(CommunityEvent $event): void;
}
