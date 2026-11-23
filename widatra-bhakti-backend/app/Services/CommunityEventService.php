<?php

namespace App\Services;

use App\Models\CommunityEvent;
use App\Models\CommunityEventDocument;
use App\Models\CommunityEventNote;
use App\Models\CommunityEventStatusHistory;
use App\Models\MediaAsset;
use App\Models\User;
use App\Repositories\Contracts\CommunityEventRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class CommunityEventService
{
    public function __construct(
        private CommunityEventRepositoryInterface $events,
        private ArticleService $articles,
        private NotificationService $notifications,
    ) {}

    public function all(): Collection
    {
        return $this->events->all();
    }

    public function adminQueue(): Collection
    {
        return $this->events->adminQueue();
    }

    public function forUser(User $user): Collection
    {
        return $this->events->forUser($user->id);
    }

    public function find(string $id): ?CommunityEvent
    {
        return $this->events->find($id);
    }

    /** Create a new submission — always starts life as a Draft. */
    public function createDraft(User $submitter, array $input): CommunityEvent
    {
        $now = now();
        $event = $this->events->create([
            'id' => IdGenerator::make('EVT'),
            'user_id' => $submitter->id,
            'submitter_name' => $submitter->name,
            'submitter_email' => $submitter->email,
            'title' => $input['title'],
            'community' => $input['community'],
            'category' => $input['category'],
            'event_date' => $input['event_date'],
            'location' => $input['location'],
            'summary' => $input['summary'],
            'description' => $input['description'],
            'cover_image' => $input['cover_image'] ?? null,
            'gallery' => $input['gallery'] ?? [],
            'tags' => $input['tags'] ?? [],
            'contact_person' => $input['contact_person'] ?? null,
            'contact_phone' => $input['contact_phone'] ?? null,
            'agreement_accepted' => (bool) ($input['agreement_accepted'] ?? false),
            'status' => 'Draft',
        ]);

        CommunityEventStatusHistory::create([
            'community_event_id' => $event->id,
            'status' => 'Draft',
            'happened_at' => $now,
        ]);

        return $event->fresh(['documents', 'statusHistory', 'adminNotes']);
    }

    /** Edit an existing submission — only while Draft / Revision Requested. */
    public function update(CommunityEvent $event, array $input): CommunityEvent
    {
        if (! in_array($event->status, ['Draft', 'Revision Requested'], true)) {
            throw ValidationException::withMessages([
                'status' => 'This submission can no longer be edited.',
            ]);
        }

        $event->update(array_intersect_key($input, array_flip([
            'title', 'community', 'category', 'event_date', 'location', 'summary',
            'description', 'cover_image', 'gallery', 'tags', 'contact_person',
            'contact_phone', 'agreement_accepted',
        ])));

        return $event->fresh(['documents', 'statusHistory', 'adminNotes']);
    }

    public function delete(CommunityEvent $event): void
    {
        if ($event->status !== 'Draft') {
            throw ValidationException::withMessages([
                'status' => 'Only draft submissions can be deleted.',
            ]);
        }

        foreach ($event->documents as $doc) {
            Storage::disk('public')->delete($doc->path);
        }

        $this->events->delete($event);
    }

    public function addDocument(CommunityEvent $event, UploadedFile $file): CommunityEventDocument
    {
        $path = $file->store("community-events/{$event->id}", 'public');

        return CommunityEventDocument::create([
            'community_event_id' => $event->id,
            'name' => $file->getClientOriginalName(),
            'path' => $path,
            'type' => $file->getClientMimeType(),
            'size' => $file->getSize(),
        ]);
    }

    /** User submits a Draft / Revision Requested event for admin review. */
    public function submitForReview(CommunityEvent $event): CommunityEvent
    {
        $now = now();
        $event->update([
            'status' => 'Pending',
            'submitted_at' => $event->submitted_at ?? $now,
        ]);
        CommunityEventStatusHistory::create([
            'community_event_id' => $event->id,
            'status' => 'Pending',
            'happened_at' => $now,
        ]);

        return $event->fresh(['documents', 'statusHistory', 'adminNotes']);
    }

    private function applyStatusChange(CommunityEvent $event, string $status, ?string $note, User $author): CommunityEvent
    {
        $now = now();
        $event->update(['status' => $status]);
        CommunityEventStatusHistory::create([
            'community_event_id' => $event->id,
            'status' => $status,
            'note' => $note,
            'happened_at' => $now,
        ]);
        if ($note) {
            CommunityEventNote::create([
                'community_event_id' => $event->id,
                'author_id' => $author->id,
                'author_name' => $author->name,
                'note' => $note,
            ]);
        }

        return $event->fresh(['documents', 'statusHistory', 'adminNotes']);
    }

    public function approve(CommunityEvent $event, User $author): CommunityEvent
    {
        $event = $this->applyStatusChange($event, 'Approved', null, $author);
        $this->notifications->notify($event->user, "Event approved — {$event->title}", 'Your community event submission has been approved.', 'success', '/applicant/events');

        return $event;
    }

    public function reject(CommunityEvent $event, string $reason, User $author): CommunityEvent
    {
        $event = $this->applyStatusChange($event, 'Rejected', $reason, $author);
        $this->notifications->notify($event->user, "Event rejected — {$event->title}", $reason, 'danger', '/applicant/events');

        return $event;
    }

    public function requestRevision(CommunityEvent $event, string $note, User $author): CommunityEvent
    {
        $event = $this->applyStatusChange($event, 'Revision Requested', $note, $author);
        $this->notifications->notify($event->user, "Revision requested — {$event->title}", $note, 'warning', '/applicant/events');

        return $event;
    }

    /** Admin edits fields directly (e.g. "Edit before publishing") without changing status. */
    public function adminUpdate(CommunityEvent $event, array $input): CommunityEvent
    {
        $event->update(array_intersect_key($input, array_flip([
            'title', 'community', 'category', 'event_date', 'location', 'summary',
            'description', 'cover_image', 'gallery', 'tags', 'contact_person', 'contact_phone',
        ])));

        return $event->fresh(['documents', 'statusHistory', 'adminNotes']);
    }

    /**
     * Publish a submission straight to the News & Event page: creates (or
     * updates, if already published once) a Published article and links it
     * back on the community event record — the sync point between the Admin
     * console, the User Dashboard, and the public News & Event page.
     */
    public function publish(CommunityEvent $event, User $author): CommunityEvent
    {
        $articleInput = [
            'title' => $event->title,
            'cat' => 'Events',
            'date' => $event->event_date->format('F d, Y'),
            'published_on' => $event->event_date,
            'read' => '2 min read',
            'excerpt' => $event->summary,
            'img' => $event->cover_image ?: MediaAsset::toRef('seed-team'),
            'content' => $event->description,
            'gallery' => ! empty($event->gallery) ? $event->gallery : [$event->cover_image],
            'tags' => $event->tags,
            'author' => $event->contact_person ?: $event->submitter_name,
            'author_role' => $event->community,
            'status' => 'Published',
        ];

        if ($event->published_article_slug && $this->articles->find($event->published_article_slug)) {
            $this->articles->update($this->articles->find($event->published_article_slug), $articleInput);
            $slug = $event->published_article_slug;
        } else {
            $article = $this->articles->create($articleInput);
            $slug = $article->slug;
        }

        $now = now();
        $event->update(['status' => 'Published', 'published_article_slug' => $slug]);
        CommunityEventStatusHistory::create([
            'community_event_id' => $event->id,
            'status' => 'Published',
            'happened_at' => $now,
        ]);
        CommunityEventNote::create([
            'community_event_id' => $event->id,
            'author_id' => $author->id,
            'author_name' => $author->name,
            'note' => 'Published to News & Event.',
        ]);

        $event = $event->fresh(['documents', 'statusHistory', 'adminNotes']);
        $this->notifications->notify($event->user, "Event published — {$event->title}", 'Your community event is now live on News & Event.', 'success', "/news/{$slug}");

        return $event;
    }
}
