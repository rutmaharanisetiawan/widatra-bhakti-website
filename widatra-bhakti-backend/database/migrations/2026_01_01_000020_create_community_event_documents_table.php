<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('community_event_documents', function (Blueprint $table) {
            $table->id();
            $table->string('community_event_id');
            $table->foreign('community_event_id')->references('id')->on('community_events')->cascadeOnDelete();
            $table->string('name');
            $table->string('path');
            $table->string('type', 64);
            $table->unsignedBigInteger('size')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('community_event_documents');
    }
};
