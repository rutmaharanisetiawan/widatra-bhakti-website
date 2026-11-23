<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('interviews', function (Blueprint $table) {
            $table->id();
            $table->string('application_id')->unique();
            $table->foreign('application_id')->references('id')->on('applications')->cascadeOnDelete();
            $table->date('date');
            $table->time('time');
            $table->enum('type', ['Online', 'Offline']);
            $table->string('location_or_link');
            $table->string('interviewer');
            $table->text('notes')->nullable();
            $table->enum('status', ['Scheduled', 'Cancelled'])->default('Scheduled');
            $table->timestamp('scheduled_at');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('interviews');
    }
};
