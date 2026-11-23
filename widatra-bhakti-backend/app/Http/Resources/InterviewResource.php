<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Interview */
class InterviewResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'date' => $this->date?->toDateString(),
            'time' => $this->time,
            'type' => $this->type,
            'location_or_link' => $this->location_or_link,
            'interviewer' => $this->interviewer,
            'notes' => $this->notes,
            'status' => $this->status,
            'scheduled_at' => $this->scheduled_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
