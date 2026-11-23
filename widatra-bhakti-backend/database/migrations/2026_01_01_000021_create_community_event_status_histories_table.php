<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('community_event_status_histories', function (Blueprint $table) {
            $table->id();
            $table->string('community_event_id');
            $table->foreign('community_event_id')->references('id')->on('community_events')->cascadeOnDelete();
            $table->string('status');
            $table->text('note')->nullable();
            $table->timestamp('happened_at');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('community_event_status_histories');
    }
};
