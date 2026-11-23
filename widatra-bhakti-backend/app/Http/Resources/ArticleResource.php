<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Article */
class ArticleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'slug' => $this->slug,
            'cat' => $this->cat,
            'date' => $this->date,
            'read' => $this->read,
            'title' => $this->title,
            'excerpt' => $this->excerpt,
            'img' => $this->img,
            'img_url' => $this->img_url,
            'content' => $this->content,
            'gallery' => $this->gallery,
            'tags' => $this->tags,
            'author' => $this->author,
            'author_role' => $this->author_role,
            'status' => $this->status,
        ];
    }
}
