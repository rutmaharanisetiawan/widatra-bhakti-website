<?php

namespace App\Services;

use App\Models\Article;
use App\Repositories\Contracts\ArticleRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class ArticleService
{
    public function __construct(private ArticleRepositoryInterface $articles) {}

    public function all(): Collection
    {
        return $this->articles->all();
    }

    public function published(): Collection
    {
        return $this->articles->published();
    }

    public function find(string $slug): ?Article
    {
        return $this->articles->findBySlug($slug);
    }

    public function findPublished(string $slug): ?Article
    {
        return $this->articles->findPublishedBySlug($slug);
    }

    public function related(string $slug, string $category, int $limit = 3): Collection
    {
        return $this->articles->related($slug, $category, $limit);
    }

    public function create(array $data): Article
    {
        $data['slug'] = ! empty($data['slug'])
            ? $data['slug']
            : SlugGenerator::unique($data['title'], fn ($s) => $this->articles->slugExists($s), 'article');

        return $this->articles->create($data);
    }

    public function update(Article $article, array $data): Article
    {
        return $this->articles->update($article, $data);
    }

    public function delete(Article $article): void
    {
        $this->articles->delete($article);
    }

    public function setStatus(Article $article, string $status): Article
    {
        return $this->articles->update($article, ['status' => $status]);
    }
}
