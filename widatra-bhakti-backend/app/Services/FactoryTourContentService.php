<?php

namespace App\Services;

use App\Models\FactoryTourContent;

class FactoryTourContentService
{
    public function get(): FactoryTourContent
    {
        return FactoryTourContent::current();
    }

    public function save(array $data): FactoryTourContent
    {
        $content = FactoryTourContent::current();
        $content->update([
            'hero_image' => $data['hero_image'] ?? $content->hero_image,
            'gallery' => $data['gallery'] ?? $content->gallery,
        ]);

        return $content;
    }
}
