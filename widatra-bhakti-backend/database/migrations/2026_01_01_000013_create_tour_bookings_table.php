<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tour_bookings', function (Blueprint $table) {
            // e.g. FT-260713-0001
            $table->string('id')->primary();
            // Public bookings don't require an account — optionally linked if the
            // visitor happened to be signed in when they booked.
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();

            $table->date('tour_date');
            $table->string('time_slot');

            $table->string('visitor_name');
            $table->string('organization');
            $table->string('email');
            $table->string('phone');
            $table->unsignedInteger('pax');
            $table->text('purpose');

            $table->enum('status', ['Pending', 'Reviewed', 'Approved', 'Rejected', 'Completed'])
                ->default('Pending');
            $table->timestamp('submitted_at');
            $table->timestamps();

            $table->index(['email', 'id']);
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tour_bookings');
    }
};
