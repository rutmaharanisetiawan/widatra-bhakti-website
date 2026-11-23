<?php

namespace App\Repositories\Eloquent;

use App\Models\Article;
use App\Repositories\Contracts\ArticleRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class ArticleRepository implements ArticleRepositoryInterface
{
    public function all(): Collection
    {
        return Article::orderByDesc('published_on')->orderByDesc('created_at')->get();
    }

    public function published(): Collection
    {
        return Article::where('status', 'Published')
            ->orderByDesc('published_on')->orderByDesc('created_at')->get();
    }

    public function findBySlug(string $slug): ?Article
    {
        return Article::find($slug);
    }

    public function findPublishedBySlug(string $slug): ?Article
    {
        return Article::where('slug', $slug)->where('status', 'Published')->first();
    }

    public function slugExists(string $slug): bool
    {
        return Article::whereKey($slug)->exists();
    }

    public function create(array $data): Article
    {
        return Article::create($data);
    }

    public function update(Article $article, array $data): Article
    {
        $article->update($data);

        return $article->refresh();
    }

    public function delete(Article $article): void
    {
        $article->delete();
    }

    public function related(string $slug, string $category, int $limit = 3): Collection
    {
        return Article::where('status', 'Published')
            ->where('slug', '!=', $slug)
            ->where('cat', $category)
            ->orderByDesc('published_on')
            ->limit($limit)
            ->get();
    }
}
