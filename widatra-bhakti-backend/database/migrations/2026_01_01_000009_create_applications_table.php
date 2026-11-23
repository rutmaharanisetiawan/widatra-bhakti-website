<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('applications', function (Blueprint $table) {
            // e.g. APP-260708-0001
            $table->string('id')->primary();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('job_slug')->nullable();
            $table->foreign('job_slug')->references('slug')->on('job_postings')->nullOnDelete();
            // Snapshot of the job at the time of application, so historical
            // applications still display correctly even if the posting later changes.
            $table->string('job_title');
            $table->string('department');
            $table->string('location');
            $table->string('employment_type');

            $table->string('full_name');
            $table->date('dob');
            $table->string('gender');

            $table->string('email');
            $table->string('phone');
            $table->string('address');
            $table->string('city');

            $table->json('education');
            $table->json('experience');
            $table->boolean('has_no_experience')->default(false);
            $table->text('skills');

            $table->string('linkedin')->nullable();
            $table->string('portfolio')->nullable();

            $table->string('cv_path');
            $table->string('cv_original_name');
            $table->string('cv_mime');
            $table->unsignedBigInteger('cv_size');
            $table->longText('cover_letter')->nullable();

            $table->enum('status', ['Submitted', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'])
                ->default('Submitted');
            $table->timestamp('submitted_at');
            $table->timestamps();

            $table->unique(['user_id', 'job_slug']);
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('applications');
    }
};
