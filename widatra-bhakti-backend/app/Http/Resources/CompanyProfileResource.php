<?php

namespace App\Http\Resources;

use App\Models\MediaAsset;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\CompanyProfile */
class CompanyProfileResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'hero_image' => $this->hero_image,
            'hero_image_url' => MediaAsset::resolveUrl($this->hero_image),
            'facility_gallery' => $this->facility_gallery,
            'facility_gallery_urls' => array_map(fn ($ref) => MediaAsset::resolveUrl($ref), $this->facility_gallery ?? []),
            'leadership_photos' => $this->leadership_photos,
        ];
    }
}
