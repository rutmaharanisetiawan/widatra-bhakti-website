<?php

namespace App\Services;

use App\Models\CsrProgram;
use App\Repositories\Contracts\CsrProgramRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class CsrProgramService
{
    public function __construct(private CsrProgramRepositoryInterface $programs) {}

    public function all(): Collection
    {
        return $this->programs->all();
    }

    public function published(): Collection
    {
        return $this->programs->published();
    }

    public function find(string $slug): ?CsrProgram
    {
        return $this->programs->findBySlug($slug);
    }

    public function findPublished(string $slug): ?CsrProgram
    {
        return $this->programs->findPublishedBySlug($slug);
    }

    public function create(array $data): CsrProgram
    {
        $data['slug'] = ! empty($data['slug'])
            ? $data['slug']
            : SlugGenerator::unique($data['title'], fn ($s) => $this->programs->slugExists($s), 'program');

        return $this->programs->create($data);
    }

    public function update(CsrProgram $program, array $data): CsrProgram
    {
        return $this->programs->update($program, $data);
    }

    public function delete(CsrProgram $program): void
    {
        $this->programs->delete($program);
    }

    public function setStatus(CsrProgram $program, string $status): CsrProgram
    {
        return $this->programs->update($program, ['status' => $status]);
    }
}
