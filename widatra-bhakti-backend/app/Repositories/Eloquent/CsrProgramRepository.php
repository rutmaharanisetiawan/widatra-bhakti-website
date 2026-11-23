<?php

namespace App\Repositories\Eloquent;

use App\Models\CsrProgram;
use App\Repositories\Contracts\CsrProgramRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class CsrProgramRepository implements CsrProgramRepositoryInterface
{
    public function all(): Collection
    {
        return CsrProgram::orderByDesc('published_on')->orderByDesc('created_at')->get();
    }

    public function published(): Collection
    {
        return CsrProgram::where('status', 'Published')
            ->orderByDesc('published_on')->orderByDesc('created_at')->get();
    }

    public function findBySlug(string $slug): ?CsrProgram
    {
        return CsrProgram::find($slug);
    }

    public function findPublishedBySlug(string $slug): ?CsrProgram
    {
        return CsrProgram::where('slug', $slug)->where('status', 'Published')->first();
    }

    public function slugExists(string $slug): bool
    {
        return CsrProgram::whereKey($slug)->exists();
    }

    public function create(array $data): CsrProgram
    {
        return CsrProgram::create($data);
    }

    public function update(CsrProgram $program, array $data): CsrProgram
    {
        $program->update($data);

        return $program->refresh();
    }

    public function delete(CsrProgram $program): void
    {
        $program->delete();
    }
}
