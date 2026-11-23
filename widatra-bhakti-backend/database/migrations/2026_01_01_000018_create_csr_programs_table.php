<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('csr_programs', function (Blueprint $table) {
            $table->string('slug')->primary();
            $table->string('pillar');
            $table->string('location');
            $table->string('date');
            $table->date('published_on')->nullable();
            $table->string('title');
            $table->text('excerpt');
            $table->string('img')->nullable();
            $table->longText('content');
            $table->json('gallery')->nullable();
            $table->string('impact')->nullable();
            $table->enum('status', ['Published', 'Draft'])->default('Draft');
            $table->timestamps();

            $table->index(['status', 'pillar']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('csr_programs');
    }
};
