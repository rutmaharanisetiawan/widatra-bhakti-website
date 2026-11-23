<?php

namespace App\Repositories\Contracts;

use App\Models\CsrProgram;
use Illuminate\Database\Eloquent\Collection;

interface CsrProgramRepositoryInterface
{
    public function all(): Collection;

    public function published(): Collection;

    public function findBySlug(string $slug): ?CsrProgram;

    public function findPublishedBySlug(string $slug): ?CsrProgram;

    public function slugExists(string $slug): bool;

    public function create(array $data): CsrProgram;

    public function update(CsrProgram $program, array $data): CsrProgram;

    public function delete(CsrProgram $program): void;
}
