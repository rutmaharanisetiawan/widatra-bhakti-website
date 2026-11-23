<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_postings', function (Blueprint $table) {
            $table->string('slug')->primary();
            $table->string('title');
            $table->enum('department', [
                'Production', 'Quality', 'R&D', 'Engineering',
                'Supply Chain', 'Corporate', 'Sales & Marketing',
            ]);
            $table->string('location');
            $table->enum('work_mode', ['On-site', 'Hybrid', 'Remote']);
            $table->enum('employment_type', ['Full-time', 'Contract', 'Internship']);
            $table->enum('level', ['Entry', 'Mid', 'Senior', 'Lead']);
            $table->string('salary')->nullable();
            $table->date('deadline');
            $table->date('posted');
            $table->text('summary');
            $table->longText('description');
            $table->json('responsibilities');
            $table->json('qualifications');
            $table->json('requirements');
            $table->json('benefits');
            $table->enum('status', ['Draft', 'Published'])->default('Draft');
            $table->boolean('featured')->default(false);
            // media:<id> reference (see media_assets) or a legacy raw URL.
            $table->string('cover_image')->nullable();
            $table->timestamps();

            $table->index(['status', 'department']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_postings');
    }
};
