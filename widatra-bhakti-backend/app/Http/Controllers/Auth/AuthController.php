<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\AdminLoginRequest;
use App\Http\Requests\Auth\ChangePasswordRequest;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterExternalRequest;
use App\Http\Requests\Auth\RegisterInternalRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Http\Requests\Auth\UpdateProfileRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(private AuthService $auth) {}

    /** External User registration — Full Name, Email, Phone, Password. */
    public function registerExternal(RegisterExternalRequest $request)
    {
        $user = $this->auth->registerExternal($request->validated());
        $token = $user->createToken('applicant')->plainTextToken;

        return response()->json(['user' => new UserResource($user), 'token' => $token], 201);
    }

    /** Internal Employee registration — Full Name, NIK, Department, Position, Company Email, Password. */
    public function registerInternal(RegisterInternalRequest $request)
    {
        $user = $this->auth->registerInternal($request->validated());
        $token = $user->createToken('applicant')->plainTextToken;

        return response()->json(['user' => new UserResource($user), 'token' => $token], 201);
    }

    public function login(LoginRequest $request)
    {
        $user = $this->auth->attemptLogin($request->input('email'), $request->input('password'));
        $token = $user->createToken('applicant')->plainTextToken;

        return response()->json(['user' => new UserResource($user), 'token' => $token]);
    }

    /** Admin & HR console sign-in — Employee ID or Email + Password. */
    public function adminLogin(AdminLoginRequest $request)
    {
        $identifier = $request->input('employee_id') ?? $request->input('email') ?? $request->input('identifier');
        if (! $identifier) {
            return response()->json(['message' => 'Please provide an Employee ID or Email.'], 422);
        }

        $user = $this->auth->attemptAdminLogin($identifier, $request->input('password'));
        $token = $user->createToken('admin-console')->plainTextToken;

        return response()->json(['user' => new UserResource($user), 'token' => $token]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out.']);
    }

    public function me(Request $request)
    {
        return new UserResource($request->user());
    }

    public function updateProfile(UpdateProfileRequest $request)
    {
        $user = $this->auth->updateProfile($request->user(), $request->validated());

        return new UserResource($user);
    }

    public function changePassword(ChangePasswordRequest $request)
    {
        $this->auth->changePassword($request->user(), $request->input('current_password'), $request->input('new_password'));

        return response()->json(['message' => 'Password updated.']);
    }

    public function forgotPassword(ForgotPasswordRequest $request)
    {
        $this->auth->requestPasswordReset($request->input('email'));

        // Always resolves ok, so the UI never reveals whether an email exists.
        return response()->json(['message' => 'If that email exists, a reset link has been sent.']);
    }

    public function resetPassword(ResetPasswordRequest $request)
    {
        $this->auth->resetPassword($request->input('email'), $request->input('token'), $request->input('password'));

        return response()->json(['message' => 'Password has been reset.']);
    }
}
