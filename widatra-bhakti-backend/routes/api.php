<?php

use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\ChatbotController;
use App\Http\Controllers\Api\CommunityEventController;
use App\Http\Controllers\Api\CompanyProfileController;
use App\Http\Controllers\Api\ContactInquiryController;
use App\Http\Controllers\Api\CsrProgramController;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\FactoryTourContentController;
use App\Http\Controllers\Api\JobPostingController;
use App\Http\Controllers\Api\MediaAssetController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\TourBookingController;
use App\Http\Controllers\Api\UserManagementController;
use App\Http\Controllers\Auth\AuthController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Every route consumed by the React/TanStack frontend. Public marketing
| pages (Home, About, Products, News, CSR, Careers, Factory Tour, Contact,
| Management) read from the read-only GET endpoints with no auth required.
| The Applicant/Employee Dashboard and Admin console sit behind Sanctum.
|
*/

// ------------------------------------------------------------------
// Auth
// ------------------------------------------------------------------
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'registerExternal']);
    Route::post('/register/internal', [AuthController::class, 'registerInternal']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/admin/login', [AuthController::class, 'adminLogin']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::patch('/profile', [AuthController::class, 'updateProfile']);
        Route::post('/change-password', [AuthController::class, 'changePassword']);
    });
});

// ------------------------------------------------------------------
// Public content — Careers / Job Postings
// ------------------------------------------------------------------
Route::get('/jobs', [JobPostingController::class, 'index']);
Route::get('/jobs/{slug}', [JobPostingController::class, 'show']);

// ------------------------------------------------------------------
// Public content — News & Event
// ------------------------------------------------------------------
Route::get('/articles', [ArticleController::class, 'index']);
Route::get('/articles/{slug}', [ArticleController::class, 'show']);
Route::get('/articles/{slug}/related', [ArticleController::class, 'related']);

// ------------------------------------------------------------------
// Public content — Products
// ------------------------------------------------------------------
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{code}', [ProductController::class, 'show']);

// ------------------------------------------------------------------
// Public content — CSR
// ------------------------------------------------------------------
Route::get('/csr-programs', [CsrProgramController::class, 'index']);
Route::get('/csr-programs/{slug}', [CsrProgramController::class, 'show']);

// ------------------------------------------------------------------
// Public content — About / Factory Tour imagery (CMS-managed settings)
// ------------------------------------------------------------------
Route::get('/company-profile', [CompanyProfileController::class, 'show']);
Route::get('/factory-tour-content', [FactoryTourContentController::class, 'show']);

// ------------------------------------------------------------------
// Public — Factory Tour booking (no account required)
// ------------------------------------------------------------------
Route::post('/tour-bookings', [TourBookingController::class, 'store']);
Route::get('/tour-bookings/lookup', [TourBookingController::class, 'lookup']);

// ------------------------------------------------------------------
// Public — Contact form
// ------------------------------------------------------------------
Route::post('/contact-inquiries', [ContactInquiryController::class, 'store']);

// ------------------------------------------------------------------
// Public — Media Library (read-only listing, used by public pages to
// resolve image URLs; create/rename/move/replace/delete stay protected)
// ------------------------------------------------------------------
Route::get('/media', [MediaAssetController::class, 'index']);

// ------------------------------------------------------------------
// Public — Chatbot Assistant (Wida-Bot with Gemini API)
// ------------------------------------------------------------------
Route::post('/chat', [ChatbotController::class, 'chat']);

// ------------------------------------------------------------------
// Authenticated — shared across Applicant/Employee & Admin (Sanctum)
// ------------------------------------------------------------------
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/{notification}/read', [NotificationController::class, 'markRead']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllRead']);

    Route::get('/documents', [DocumentController::class, 'index']);
    Route::post('/documents', [DocumentController::class, 'store']);
    Route::delete('/documents/{document}', [DocumentController::class, 'destroy']);

    // ---- Career ATS (external applicants submit; HR/Admin manage) ----
    Route::get('/applications', [ApplicationController::class, 'index']);
    Route::get('/applications/mine', [ApplicationController::class, 'mine']);
    Route::post('/applications', [ApplicationController::class, 'store']);
    Route::get('/applications/{application}', [ApplicationController::class, 'show']);
    Route::patch('/applications/{application}/status', [ApplicationController::class, 'updateStatus']);
    Route::post('/applications/{application}/interview', [ApplicationController::class, 'scheduleInterview']);
    Route::patch('/applications/{application}/interview', [ApplicationController::class, 'updateInterview']);
    Route::post('/applications/{application}/interview/cancel', [ApplicationController::class, 'cancelInterview']);
    Route::post('/applications/{application}/hr-notes', [ApplicationController::class, 'addHrNote']);

    // ---- Factory Tour bookings management (HR/Admin/CSR Coordinator) ----
    Route::get('/tour-bookings', [TourBookingController::class, 'index']);
    Route::get('/tour-bookings/{tourBooking}', [TourBookingController::class, 'show']);
    Route::patch('/tour-bookings/{tourBooking}/status', [TourBookingController::class, 'updateStatus']);
    Route::post('/tour-bookings/{tourBooking}/notes', [TourBookingController::class, 'addNote']);

    // ---- Community Events (internal employees submit; HR/Admin approve) ----
    Route::get('/community-events', [CommunityEventController::class, 'index']);
    Route::get('/community-events/mine', [CommunityEventController::class, 'mine']);
    Route::post('/community-events', [CommunityEventController::class, 'store']);
    Route::get('/community-events/{communityEvent}', [CommunityEventController::class, 'show']);
    Route::put('/community-events/{communityEvent}', [CommunityEventController::class, 'update']);
    Route::delete('/community-events/{communityEvent}', [CommunityEventController::class, 'destroy']);
    Route::post('/community-events/{communityEvent}/documents', [CommunityEventController::class, 'uploadDocument']);
    Route::post('/community-events/{communityEvent}/submit', [CommunityEventController::class, 'submitForReview']);
    Route::post('/community-events/{communityEvent}/approve', [CommunityEventController::class, 'approve']);
    Route::post('/community-events/{communityEvent}/reject', [CommunityEventController::class, 'reject']);
    Route::post('/community-events/{communityEvent}/request-revision', [CommunityEventController::class, 'requestRevision']);
    Route::put('/community-events/{communityEvent}/admin', [CommunityEventController::class, 'adminUpdate']);
    Route::post('/community-events/{communityEvent}/publish', [CommunityEventController::class, 'publish']);

    // ---- Admin — Contact Inbox ----
    Route::get('/contact-inquiries', [ContactInquiryController::class, 'index']);
    Route::get('/contact-inquiries/counts', [ContactInquiryController::class, 'counts']);
    Route::get('/contact-inquiries/{contactInquiry}', [ContactInquiryController::class, 'show']);
    Route::post('/contact-inquiries/{contactInquiry}/archive', [ContactInquiryController::class, 'archive']);
    Route::post('/contact-inquiries/{contactInquiry}/unarchive', [ContactInquiryController::class, 'unarchive']);
    Route::post('/contact-inquiries/{contactInquiry}/reply', [ContactInquiryController::class, 'reply']);

    // ---- Admin — Job Postings (Careers & ATS module) ----
    Route::get('/admin/jobs/{jobPosting}', [JobPostingController::class, 'showAdmin']);
    Route::post('/jobs', [JobPostingController::class, 'store']);
    Route::put('/jobs/{jobPosting}', [JobPostingController::class, 'update']);
    Route::delete('/jobs/{jobPosting}', [JobPostingController::class, 'destroy']);
    Route::patch('/jobs/{jobPosting}/status', [JobPostingController::class, 'setStatus']);
    Route::patch('/jobs/{jobPosting}/featured', [JobPostingController::class, 'setFeatured']);

    // ---- Admin — News & Event ----
    Route::get('/admin/articles/{article}', [ArticleController::class, 'showAdmin']);
    Route::post('/articles', [ArticleController::class, 'store']);
    Route::put('/articles/{article}', [ArticleController::class, 'update']);
    Route::delete('/articles/{article}', [ArticleController::class, 'destroy']);
    Route::patch('/articles/{article}/status', [ArticleController::class, 'setStatus']);

    // ---- Admin — Products ----
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{product}', [ProductController::class, 'update']);
    Route::delete('/products/{product}', [ProductController::class, 'destroy']);

    // ---- Admin — CSR ----
    Route::get('/admin/csr-programs/{csrProgram}', [CsrProgramController::class, 'showAdmin']);
    Route::post('/csr-programs', [CsrProgramController::class, 'store']);
    Route::put('/csr-programs/{csrProgram}', [CsrProgramController::class, 'update']);
    Route::delete('/csr-programs/{csrProgram}', [CsrProgramController::class, 'destroy']);
    Route::patch('/csr-programs/{csrProgram}/status', [CsrProgramController::class, 'setStatus']);

    // ---- Admin — Media Library (mutations only; listing is public above) ----
    Route::post('/media', [MediaAssetController::class, 'store']);
    Route::patch('/media/{mediaAsset}/rename', [MediaAssetController::class, 'rename']);
    Route::patch('/media/{mediaAsset}/move', [MediaAssetController::class, 'move']);
    Route::post('/media/{mediaAsset}/replace', [MediaAssetController::class, 'replace']);
    Route::delete('/media/{mediaAsset}', [MediaAssetController::class, 'destroy']);

    // ---- Admin — Company Profile CMS / Factory Tour content ----
    Route::put('/company-profile', [CompanyProfileController::class, 'update']);
    Route::put('/factory-tour-content', [FactoryTourContentController::class, 'update']);

    // ---- Admin — Users & Role Management ----
    Route::get('/admin/users', [UserManagementController::class, 'index']);
    Route::patch('/admin/users/{user}/role', [UserManagementController::class, 'updateRole']);
    Route::patch('/admin/users/{user}/status', [UserManagementController::class, 'setStatus']);
    Route::get('/admin/audit-logs', [UserManagementController::class, 'auditLogs']);
});