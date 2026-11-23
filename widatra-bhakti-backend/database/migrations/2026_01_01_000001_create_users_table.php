<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            // e.g. USR-1721... — kept for parity with the frontend's human-readable ids,
            // exposed as `id` in API responses via the UserResource.
            $table->string('public_id')->unique();
            $table->enum('account_type', ['internal', 'external'])->default('external');
            // Free-text role label. Access control is driven by account_type + this role,
            // see App\Enums\UserRole and the `role` / `account_type` route middleware.
            $table->string('role')->default('External User');
            $table->enum('status', ['Active', 'Disabled'])->default('Active');
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            // Internal Employee only
            $table->string('employee_id')->nullable()->unique();
            $table->string('department')->nullable();
            $table->string('position')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
