<?php

namespace App\Repositories\Eloquent;

use App\Models\ContactInquiry;
use App\Repositories\Contracts\ContactInquiryRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class ContactInquiryRepository implements ContactInquiryRepositoryInterface
{
    public function all(): Collection
    {
        return ContactInquiry::with('replies')->orderByDesc('received_at')->get();
    }

    public function find(string $id): ?ContactInquiry
    {
        return ContactInquiry::with('replies')->find($id);
    }

    public function create(array $data): ContactInquiry
    {
        return ContactInquiry::create($data);
    }

    public function unreadCount(): int
    {
        return ContactInquiry::where('read', false)->where('archived', false)->count();
    }

    public function totalCount(): int
    {
        return ContactInquiry::where('archived', false)->count();
    }
}
