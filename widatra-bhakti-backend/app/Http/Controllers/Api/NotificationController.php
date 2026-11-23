<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\NotificationResource;
use App\Models\Notification;
use App\Services\NotificationService;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function __construct(private NotificationService $notifications) {}

    public function index(Request $request)
    {
        return NotificationResource::collection($request->user()->notifications);
    }

    public function markRead(Request $request, Notification $notification)
    {
        abort_unless($notification->user_id === $request->user()->id, 403);
        $notification = $this->notifications->markRead($notification);

        return new NotificationResource($notification);
    }

    public function markAllRead(Request $request)
    {
        $this->notifications->markAllRead($request->user());

        return response()->json(['message' => 'All notifications marked as read.']);
    }
}
