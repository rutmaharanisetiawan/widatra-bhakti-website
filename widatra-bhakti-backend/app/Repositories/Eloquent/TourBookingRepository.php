<?php

namespace App\Repositories\Eloquent;

use App\Models\TourBooking;
use App\Repositories\Contracts\TourBookingRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class TourBookingRepository implements TourBookingRepositoryInterface
{
    public function all(): Collection
    {
        return TourBooking::with(['statusHistory', 'notes'])->orderByDesc('submitted_at')->get();
    }

    public function find(string $id): ?TourBooking
    {
        return TourBooking::with(['statusHistory', 'notes'])->whereRaw('LOWER(id) = ?', [strtolower(trim($id))])->first();
    }

    public function findByIdAndEmail(string $id, string $email): ?TourBooking
    {
        $booking = $this->find($id);
        if (! $booking || strtolower(trim($booking->email)) !== strtolower(trim($email))) {
            return null;
        }

        return $booking;
    }

    public function create(array $data): TourBooking
    {
        return TourBooking::create($data);
    }
}
