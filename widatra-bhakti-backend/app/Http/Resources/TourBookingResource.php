<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\TourBooking */
class TourBookingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'tour_date' => $this->tour_date?->toDateString(),
            'time_slot' => $this->time_slot,
            'visitor_name' => $this->visitor_name,
            'organization' => $this->organization,
            'email' => $this->email,
            'phone' => $this->phone,
            'pax' => $this->pax,
            'purpose' => $this->purpose,
            'status' => $this->status,
            'status_history' => $this->statusHistory->map(fn ($h) => [
                'status' => $h->status,
                'date' => $h->happened_at?->toIso8601String(),
                'note' => $h->note,
            ]),
            'internal_notes' => $this->notes->map(fn ($n) => [
                'id' => (string) $n->id,
                'author' => $n->author_name,
                'note' => $n->note,
                'date' => $n->created_at?->toIso8601String(),
            ]),
            'submitted_at' => $this->submitted_at?->toIso8601String(),
        ];
    }
}
