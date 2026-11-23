<?php

namespace Database\Factories;

use App\Models\User;
use App\Services\IdGenerator;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/** @extends Factory<User> */
class UserFactory extends Factory
{
    protected static ?string $password;

    public function definition(): array
    {
        return [
            'public_id' => IdGenerator::publicUserId(),
            'account_type' => 'external',
            'role' => 'External User',
            'status' => 'Active',
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
        ];
    }

    public function internal(): static
    {
        return $this->state(fn () => [
            'account_type' => 'internal',
            'role' => 'Internal Employee',
            'employee_id' => 'WB-EMP-'.fake()->unique()->numberBetween(1000, 9999),
            'department' => fake()->randomElement(['Human Resources', 'Production', 'Quality', 'Corporate Communications']),
            'position' => fake()->jobTitle(),
        ]);
    }

    public function admin(string $role = 'Administrator'): static
    {
        return $this->state(fn () => [
            'account_type' => 'internal',
            'role' => $role,
            'employee_id' => 'WBK-'.fake()->unique()->numberBetween(10000, 99999),
            'department' => 'Corporate',
            'position' => $role,
        ]);
    }

    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => ['email_verified_at' => null]);
    }
}
