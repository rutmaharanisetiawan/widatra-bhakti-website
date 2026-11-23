<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Custom, simple notifications table (not Laravel's default morph-based
        // notifications table) — matches the flat shape already used by the
        // frontend's dashboard "Notifications" list. Populated automatically by
        // the ATS / Tour Booking / Community Event services whenever a status
        // changes for a given user.
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('title');
            $table->string('body')->nullable();
            $table->enum('tone', ['info', 'success', 'warning', 'danger'])->default('info');
            // Optional deep link, e.g. "/applicant/applications/APP-260708-0001".
            $table->string('link')->nullable();
            $table->timestamp('read_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'read_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
