<?php

namespace App\Repositories\Contracts;

use App\Models\Article;
use Illuminate\Database\Eloquent\Collection;

interface ArticleRepositoryInterface
{
    public function all(): Collection;

    public function published(): Collection;

    public function findBySlug(string $slug): ?Article;

    public function findPublishedBySlug(string $slug): ?Article;

    public function slugExists(string $slug): bool;

    public function create(array $data): Article;

    public function update(Article $article, array $data): Article;

    public function delete(Article $article): void;

    public function related(string $slug, string $category, int $limit = 3): Collection;
}
