<?php

namespace App\Repositories\Contracts;

use App\Models\TourBooking;
use Illuminate\Database\Eloquent\Collection;

interface TourBookingRepositoryInterface
{
    public function all(): Collection;

    public function find(string $id): ?TourBooking;

    public function findByIdAndEmail(string $id, string $email): ?TourBooking;

    public function create(array $data): TourBooking;
}
