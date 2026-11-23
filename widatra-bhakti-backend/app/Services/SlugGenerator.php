<?php

namespace App\Services;

use Illuminate\Support\Str;

class SlugGenerator
{
    /** Generates a unique slug for the given title, checking against $exists(slug). */
    public static function unique(string $title, callable $exists, string $fallback = 'item'): string
    {
        $base = Str::slug($title) ?: $fallback;
        if (! $exists($base)) {
            return $base;
        }

        $i = 2;
        while ($exists("{$base}-{$i}")) {
            $i++;
        }

        return "{$base}-{$i}";
    }
}
