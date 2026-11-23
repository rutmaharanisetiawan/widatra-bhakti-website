<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contact_inquiries', function (Blueprint $table) {
            // e.g. ci-<uuid>
            $table->string('id')->primary();
            $table->string('name');
            $table->string('organization')->nullable();
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('subject');
            $table->text('message');
            // Which form on the site this came from, e.g. "Contact Page".
            $table->string('source')->default('Contact Page');
            $table->timestamp('received_at');
            $table->boolean('read')->default(false);
            $table->boolean('archived')->default(false);
            $table->timestamps();

            $table->index(['archived', 'read']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contact_inquiries');
    }
};
