<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('media_assets', function (Blueprint $table) {
            // Human-readable slug id (e.g. "seed-hero-cleanroom", "iv-bag-x7f2q1") —
            // referenced everywhere else in the schema as a `media:<id>` string,
            // exactly like the frontend's media-store.ts convention.
            $table->string('id')->primary();
            $table->string('name');
            $table->string('path');
            $table->enum('folder', [
                'Products', 'News & Event', 'CSR', 'Factory Tour',
                'Company Profile', 'Gallery', 'Others',
            ]);
            $table->string('type', 64);
            $table->unsignedBigInteger('size')->default(0);
            $table->timestamps();

            $table->index('folder');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('media_assets');
    }
};
