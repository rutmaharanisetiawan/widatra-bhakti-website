<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->string('slug')->primary();
            $table->enum('cat', ['Corporate', 'People', 'Sustainability', 'Events']);
            // Display date string exactly as authored (e.g. "November 08, 2023"),
            // kept alongside a real date for sorting/filtering.
            $table->string('date');
            $table->date('published_on')->nullable();
            $table->string('read')->nullable();
            $table->string('title');
            $table->text('excerpt');
            $table->string('img')->nullable();
            $table->longText('content');
            $table->json('gallery')->nullable();
            $table->json('tags')->nullable();
            $table->string('author')->nullable();
            $table->string('author_role')->nullable();
            $table->enum('status', ['Published', 'Draft'])->default('Draft');
            $table->timestamps();

            $table->index(['status', 'cat']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
