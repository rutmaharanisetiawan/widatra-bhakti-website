<?php

namespace App\Services;

use App\Models\TourBooking;
use App\Models\TourNote;
use App\Models\TourStatusHistory;
use App\Models\User;
use App\Repositories\Contracts\TourBookingRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class TourBookingService
{
    public function __construct(private TourBookingRepositoryInterface $bookings) {}

    public function all(): Collection
    {
        return $this->bookings->all();
    }

    public function find(string $id): ?TourBooking
    {
        return $this->bookings->find($id);
    }

    public function findByIdAndEmail(string $id, string $email): ?TourBooking
    {
        return $this->bookings->findByIdAndEmail($id, $email);
    }

    /** Public booking form — no account required, matches tour-store.ts addBooking(). */
    public function submit(array $input, ?User $user = null): TourBooking
    {
        $submittedAt = now();

        $booking = $this->bookings->create([
            'id' => IdGenerator::make('FT'),
            'user_id' => $user?->id,
            'tour_date' => $input['tour_date'],
            'time_slot' => $input['time_slot'],
            'visitor_name' => $input['visitor_name'],
            'organization' => $input['organization'],
            'email' => $input['email'],
            'phone' => $input['phone'],
            'pax' => $input['pax'],
            'purpose' => $input['purpose'],
            'status' => 'Pending',
            'submitted_at' => $submittedAt,
        ]);

        TourStatusHistory::create([
            'tour_booking_id' => $booking->id,
            'status' => 'Pending',
            'happened_at' => $submittedAt,
        ]);

        return $booking->fresh(['statusHistory', 'notes']);
    }

    public function updateStatus(TourBooking $booking, string $status, ?string $note = null): TourBooking
    {
        $booking->update(['status' => $status]);
        TourStatusHistory::create([
            'tour_booking_id' => $booking->id,
            'status' => $status,
            'note' => $note ?: null,
            'happened_at' => now(),
        ]);

        return $booking->fresh(['statusHistory', 'notes']);
    }

    public function addNote(TourBooking $booking, string $note, User $author): TourBooking
    {
        TourNote::create([
            'tour_booking_id' => $booking->id,
            'author_id' => $author->id,
            'author_name' => $author->name,
            'note' => $note,
        ]);

        return $booking->fresh(['statusHistory', 'notes']);
    }
}
