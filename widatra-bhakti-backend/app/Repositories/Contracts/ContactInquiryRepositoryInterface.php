<?php

namespace App\Repositories\Contracts;

use App\Models\ContactInquiry;
use Illuminate\Database\Eloquent\Collection;

interface ContactInquiryRepositoryInterface
{
    public function all(): Collection;

    public function find(string $id): ?ContactInquiry;

    public function create(array $data): ContactInquiry;

    public function unreadCount(): int;

    public function totalCount(): int;
}
