<?php

namespace App\Repositories\Eloquent;

use App\Models\CommunityEvent;
use App\Repositories\Contracts\CommunityEventRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class CommunityEventRepository implements CommunityEventRepositoryInterface
{
    public function all(): Collection
    {
        return CommunityEvent::with(['documents', 'statusHistory', 'adminNotes'])
            ->orderByDesc('updated_at')
            ->get();
    }

    public function adminQueue(): Collection
    {
        return CommunityEvent::with(['documents', 'statusHistory', 'adminNotes'])
            ->whereIn('status', CommunityEvent::ADMIN_VISIBLE_STATUSES)
            ->orderByDesc('updated_at')
            ->get();
    }

    public function forUser(int $userId): Collection
    {
        return CommunityEvent::with(['documents', 'statusHistory', 'adminNotes'])
            ->where('user_id', $userId)
            ->orderByDesc('updated_at')
            ->get();
    }

    public function find(string $id): ?CommunityEvent
    {
        return CommunityEvent::with(['documents', 'statusHistory', 'adminNotes'])->find($id);
    }

    public function create(array $data): CommunityEvent
    {
        return CommunityEvent::create($data);
    }

    public function update(CommunityEvent $event, array $data): CommunityEvent
    {
        $event->update($data);

        return $event->refresh();
    }

    public function delete(CommunityEvent $event): void
    {
        $event->delete();
    }
}
