<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Single-row settings table for the public About page imagery.
        Schema::create('company_profile', function (Blueprint $table) {
            $table->id();
            $table->string('hero_image')->nullable();
            $table->json('facility_gallery')->nullable();
            $table->json('leadership_photos')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('company_profile');
    }
};
