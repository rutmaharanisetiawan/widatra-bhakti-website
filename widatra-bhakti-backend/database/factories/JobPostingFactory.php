<?php

namespace Database\Factories;

use App\Models\JobPosting;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/** @extends Factory<JobPosting> */
class JobPostingFactory extends Factory
{
    public function definition(): array
    {
        $title = fake()->jobTitle();

        return [
            'slug' => Str::slug($title).'-'.fake()->unique()->numberBetween(1, 9999),
            'title' => $title,
            'department' => fake()->randomElement(['Production', 'Quality', 'R&D', 'Engineering', 'Supply Chain', 'Corporate', 'Sales & Marketing']),
            'location' => fake()->randomElement(['Pandaan, East Java', 'Jakarta HQ']),
            'work_mode' => fake()->randomElement(['On-site', 'Hybrid', 'Remote']),
            'employment_type' => fake()->randomElement(['Full-time', 'Contract', 'Internship']),
            'level' => fake()->randomElement(['Entry', 'Mid', 'Senior', 'Lead']),
            'salary' => null,
            'deadline' => fake()->dateTimeBetween('+1 week', '+3 months')->format('Y-m-d'),
            'posted' => fake()->dateTimeBetween('-1 month', 'now')->format('Y-m-d'),
            'summary' => fake()->sentence(20),
            'description' => fake()->paragraphs(3, true),
            'responsibilities' => fake()->sentences(4),
            'qualifications' => fake()->sentences(3),
            'requirements' => fake()->sentences(3),
            'benefits' => fake()->sentences(3),
            'status' => 'Published',
            'featured' => false,
            'cover_image' => null,
        ];
    }
}
