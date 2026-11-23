<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\RejectCommunityEventRequest;
use App\Http\Requests\StoreCommunityEventRequest;
use App\Http\Resources\CommunityEventResource;
use App\Models\CommunityEvent;
use App\Services\CommunityEventService;
use Illuminate\Http\Request;

class CommunityEventController extends Controller
{
    public function __construct(private CommunityEventService $events) {}

    /** Admin — Community Event Approval queue (Pending/Revision/Approved/Rejected/Published only). */
    public function index(Request $request)
    {
        $this->authorize('manageAny', CommunityEvent::class);

        return CommunityEventResource::collection(
            $request->boolean('all') ? $this->events->all() : $this->events->adminQueue()
        );
    }

    /** Internal Employee — "My Event Submissions", scoped to the signed-in user. */
    public function mine(Request $request)
    {
        return CommunityEventResource::collection($this->events->forUser($request->user()));
    }

    public function show(Request $request, CommunityEvent $communityEvent)
    {
        $this->authorize('view', $communityEvent);

        return new CommunityEventResource($communityEvent);
    }

    /** Internal employee creates a new Draft submission. */
    public function store(StoreCommunityEventRequest $request)
    {
        $this->authorize('create', CommunityEvent::class);
        $event = $this->events->createDraft($request->user(), $request->validated());

        return new CommunityEventResource($event);
    }

    /** Edit while Draft / Revision Requested (owner) or any time (admin, via adminUpdate below). */
    public function update(StoreCommunityEventRequest $request, CommunityEvent $communityEvent)
    {
        $this->authorize('update', $communityEvent);
        $event = $this->events->update($communityEvent, $request->validated());

        return new CommunityEventResource($event);
    }

    public function destroy(CommunityEvent $communityEvent)
    {
        $this->authorize('delete', $communityEvent);
        $this->events->delete($communityEvent);

        return response()->json(['message' => 'Draft deleted.']);
    }

    public function uploadDocument(Request $request, CommunityEvent $communityEvent)
    {
        $this->authorize('update', $communityEvent);
        $request->validate(['file' => 'required|file|max:15360']);
        $document = $this->events->addDocument($communityEvent, $request->file('file'));

        return response()->json($document);
    }

    /** Owner submits Draft/Revision Requested for admin review. */
    public function submitForReview(Request $request, CommunityEvent $communityEvent)
    {
        $this->authorize('update', $communityEvent);
        $event = $this->events->submitForReview($communityEvent);

        return new CommunityEventResource($event);
    }

    public function approve(Request $request, CommunityEvent $communityEvent)
    {
        $this->authorize('manageAny', CommunityEvent::class);
        $event = $this->events->approve($communityEvent, $request->user());

        return new CommunityEventResource($event);
    }

    public function reject(RejectCommunityEventRequest $request, CommunityEvent $communityEvent)
    {
        $this->authorize('manageAny', CommunityEvent::class);
        $event = $this->events->reject($communityEvent, $request->input('reason'), $request->user());

        return new CommunityEventResource($event);
    }

    public function requestRevision(RejectCommunityEventRequest $request, CommunityEvent $communityEvent)
    {
        $this->authorize('manageAny', CommunityEvent::class);
        $event = $this->events->requestRevision($communityEvent, $request->input('reason'), $request->user());

        return new CommunityEventResource($event);
    }

    public function adminUpdate(StoreCommunityEventRequest $request, CommunityEvent $communityEvent)
    {
        $this->authorize('manageAny', CommunityEvent::class);
        $event = $this->events->adminUpdate($communityEvent, $request->validated());

        return new CommunityEventResource($event);
    }

    /** Publishes straight to News & Event. */
    public function publish(Request $request, CommunityEvent $communityEvent)
    {
        $this->authorize('manageAny', CommunityEvent::class);
        $event = $this->events->publish($communityEvent, $request->user());

        return new CommunityEventResource($event);
    }
}
