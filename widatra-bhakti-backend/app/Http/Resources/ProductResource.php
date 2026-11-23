<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Product */
class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'code' => $this->code,
            'name' => $this->name,
            'category' => $this->category,
            'brand' => $this->brand,
            'osmolarity' => $this->osmolarity,
            'calorie' => $this->calorie,
            'nie' => $this->nie,
            'packaging' => $this->packaging,
            'sizes' => $this->sizes,
            'indication' => $this->indication,
            'benefits' => $this->benefits,
            'applications' => $this->applications,
            'storage' => $this->storage,
            'shelf_life' => $this->shelf_life,
            'composition' => $this->composition,
            'manufacturing_note' => $this->manufacturing_note,
            'img' => $this->img,
            'img_url' => $this->img_url,
            'tagline' => $this->tagline,
        ];
    }
}
