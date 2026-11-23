<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\CsrProgram */
class CsrProgramResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'slug' => $this->slug,
            'pillar' => $this->pillar,
            'location' => $this->location,
            'date' => $this->date,
            'title' => $this->title,
            'excerpt' => $this->excerpt,
            'img' => $this->img,
            'img_url' => $this->img_url,
            'content' => $this->content,
            'gallery' => $this->gallery,
            'impact' => $this->impact,
            'status' => $this->status,
        ];
    }
}
