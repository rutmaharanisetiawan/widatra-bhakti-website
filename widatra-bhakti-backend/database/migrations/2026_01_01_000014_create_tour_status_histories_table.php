<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tour_status_histories', function (Blueprint $table) {
            $table->id();
            $table->string('tour_booking_id');
            $table->foreign('tour_booking_id')->references('id')->on('tour_bookings')->cascadeOnDelete();
            $table->string('status');
            $table->text('note')->nullable();
            $table->timestamp('happened_at');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tour_status_histories');
    }
};
