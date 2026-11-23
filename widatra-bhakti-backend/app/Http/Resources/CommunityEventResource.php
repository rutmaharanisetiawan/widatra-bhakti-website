<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\CommunityEvent */
class CommunityEventResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user->public_id ?? null,
            'submitter_name' => $this->submitter_name,
            'submitter_email' => $this->submitter_email,
            'title' => $this->title,
            'community' => $this->community,
            'category' => $this->category,
            'event_date' => $this->event_date?->toDateString(),
            'location' => $this->location,
            'summary' => $this->summary,
            'description' => $this->description,
            'cover_image' => $this->cover_image,
            'cover_image_url' => $this->cover_image_url,
            'gallery' => $this->gallery,
            'documents' => $this->documents->map(fn ($d) => [
                'name' => $d->name,
                'type' => $d->type,
                'size' => $d->size,
                'url' => $d->url,
            ]),
            'tags' => $this->tags,
            'contact_person' => $this->contact_person,
            'contact_phone' => $this->contact_phone,
            'agreement_accepted' => $this->agreement_accepted,
            'status' => $this->status,
            'status_history' => $this->statusHistory->map(fn ($h) => [
                'status' => $h->status,
                'date' => $h->happened_at?->toIso8601String(),
                'note' => $h->note,
            ]),
            'admin_notes' => $this->adminNotes->map(fn ($n) => [
                'id' => (string) $n->id,
                'author' => $n->author_name,
                'note' => $n->note,
                'date' => $n->created_at?->toIso8601String(),
            ]),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
            'submitted_at' => $this->submitted_at?->toIso8601String(),
            'published_article_slug' => $this->published_article_slug,
        ];
    }
}
