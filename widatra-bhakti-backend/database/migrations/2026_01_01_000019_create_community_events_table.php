<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('community_events', function (Blueprint $table) {
            // e.g. EVT-260724-0001
            $table->string('id')->primary();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('submitter_name');
            $table->string('submitter_email');

            $table->string('title');
            $table->string('community');
            $table->string('category');
            $table->date('event_date');
            $table->string('location');
            $table->text('summary');
            $table->longText('description');
            $table->string('cover_image')->nullable();
            $table->json('gallery')->nullable();
            $table->json('tags')->nullable();
            $table->string('contact_person')->nullable();
            $table->string('contact_phone')->nullable();
            $table->boolean('agreement_accepted')->default(false);

            $table->enum('status', ['Draft', 'Pending', 'Revision Requested', 'Approved', 'Rejected', 'Published'])
                ->default('Draft');
            $table->timestamp('submitted_at')->nullable();
            // Links back to the published News & Event article once published.
            $table->string('published_article_slug')->nullable();
            $table->foreign('published_article_slug')->references('slug')->on('articles')->nullOnDelete();
            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('community_events');
    }
};
