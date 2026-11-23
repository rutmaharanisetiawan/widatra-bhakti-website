<?php

namespace App\Http\Resources;

use App\Models\MediaAsset;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\FactoryTourContent */
class FactoryTourContentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'hero_image' => $this->hero_image,
            'hero_image_url' => MediaAsset::resolveUrl($this->hero_image),
            'gallery' => $this->gallery,
            'gallery_urls' => array_map(fn ($ref) => MediaAsset::resolveUrl($ref), $this->gallery ?? []),
        ];
    }
}
