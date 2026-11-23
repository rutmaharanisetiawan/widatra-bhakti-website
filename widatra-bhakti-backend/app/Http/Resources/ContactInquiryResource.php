<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\ContactInquiry */
class ContactInquiryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'organization' => $this->organization,
            'email' => $this->email,
            'phone' => $this->phone,
            'subject' => $this->subject,
            'message' => $this->message,
            'source' => $this->source,
            'received_at' => $this->received_at?->toIso8601String(),
            'read' => $this->read,
            'archived' => $this->archived,
            'status' => $this->derived_status,
            'replies' => $this->replies->map(fn ($r) => [
                'id' => (string) $r->id,
                'message' => $r->message,
                'sent_at' => $r->sent_at?->toIso8601String(),
            ]),
        ];
    }
}
