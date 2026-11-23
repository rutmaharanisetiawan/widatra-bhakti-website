<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class MediaAsset extends Model
{
    use HasFactory;

    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['id', 'name', 'path', 'folder', 'type', 'size'];

    public const FOLDERS = [
        'Products', 'News & Event', 'CSR', 'Factory Tour',
        'Company Profile', 'Gallery', 'Others',
    ];

    public const REF_PREFIX = 'media:';

    public static function toRef(string $id): string
    {
        return self::REF_PREFIX.$id;
    }

    public static function isRef(?string $value): bool
    {
        return $value !== null && str_starts_with($value, self::REF_PREFIX);
    }

    public static function refId(string $value): string
    {
        return substr($value, strlen(self::REF_PREFIX));
    }

    /** Resolve a `media:<id>` reference (or a raw/legacy URL) to a displayable URL. */
    public static function resolveUrl(?string $value): ?string
    {
        if (! $value) {
            return null;
        }
        if (self::isRef($value)) {
            $asset = self::find(self::refId($value));

            return $asset?->url;
        }

        return $value;
    }

    public function getUrlAttribute(): string
    {
        return Storage::disk('public')->url($this->path);
    }
}
