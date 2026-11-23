<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SetStatusRequest;
use App\Http\Requests\StoreArticleRequest;
use App\Http\Requests\UpdateArticleRequest;
use App\Http\Resources\ArticleResource;
use App\Models\Article;
use App\Services\ArticleService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ArticleController extends Controller
{
    public function __construct(private ArticleService $articles) {}

    /** Public News & Event listing — published only, unless ?all=1 from Admin. */
    public function index(Request $request)
    {
        if ($request->boolean('all')) {
            // This GET route is registered outside the auth:sanctum group
            // (it must stay public for anonymous visitors), so the default
            // guard never sees the Bearer token here. Resolve the user via
            // the sanctum guard explicitly so a logged-in admin's token is
            // actually recognised for the ?all=1 (drafts included) request.
            Gate::forUser($request->user('sanctum'))->authorize('manage-content');

            return ArticleResource::collection($this->articles->all());
        }

        return ArticleResource::collection($this->articles->published());
    }

    public function show(string $slug)
    {
        $article = $this->articles->findPublished($slug);
        abort_if(! $article, 404);

        return new ArticleResource($article);
    }

    public function related(string $slug)
    {
        $article = $this->articles->findPublished($slug);
        abort_if(! $article, 404);

        return ArticleResource::collection($this->articles->related($slug, $article->cat));
    }

    public function showAdmin(Article $article)
    {
        $this->authorize('manage-content');

        return new ArticleResource($article);
    }

    public function store(StoreArticleRequest $request)
    {
        $this->authorize('manage-content');
        $article = $this->articles->create($request->validated());

        return new ArticleResource($article);
    }

    public function update(UpdateArticleRequest $request, Article $article)
    {
        $this->authorize('manage-content');
        $article = $this->articles->update($article, $request->validated());

        return new ArticleResource($article);
    }

    public function destroy(Article $article)
    {
        $this->authorize('manage-content');
        $this->articles->delete($article);

        return response()->json(['message' => 'Article deleted.']);
    }

    public function setStatus(SetStatusRequest $request, Article $article)
    {
        $this->authorize('manage-content');
        $article = $this->articles->setStatus($article, $request->input('status'));

        return new ArticleResource($article);
    }
}