<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\AuthService;
use Illuminate\Http\Request;

class UserManagementController extends Controller
{
    public function __construct(private AuthService $auth) {}

    /** Admin > Users & Role Management. */
    public function index()
    {
        $this->authorize('manage-users');

        return UserResource::collection(User::orderByDesc('created_at')->get());
    }

    public function updateRole(Request $request, User $user)
    {
        $this->authorize('manage-users');
        $request->validate([
            'role' => 'required|in:Super Admin,Content Admin,HR Manager,Event Moderator,Factory Tour Admin,Internal Employee,External User,Administrator,Content Editor,CSR Coordinator',
        ]);
        $user = $this->auth->adminUpdateRole($user, $request->input('role'));

        return new UserResource($user);
    }

    public function setStatus(Request $request, User $user)
    {
        $this->authorize('manage-users');
        $request->validate(['status' => 'required|in:Active,Disabled']);
        $user = $this->auth->adminSetStatus($user, $request->input('status'));

        return new UserResource($user);
    }

    public function auditLogs()
    {
        $this->authorize('manage-users');

        return response()->json([
            'data' => \App\Models\AuditLog::orderByDesc('created_at')->limit(100)->get()
        ]);
    }
}
