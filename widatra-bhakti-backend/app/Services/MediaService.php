<?php

namespace App\Services;

use App\Models\MediaAsset;
use App\Repositories\Contracts\MediaAssetRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class MediaService
{
    public const ACCEPTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'];

    public const MAX_SOURCE_BYTES = 15 * 1024 * 1024; // 15MB, matches image-upload.ts

    public function __construct(private MediaAssetRepositoryInterface $media) {}

    public function all(): Collection
    {
        return $this->media->all();
    }

    public function byFolder(string $folder): Collection
    {
        return $this->media->byFolder($folder);
    }

    public function search(string $query, ?string $folder = null): Collection
    {
        return $this->media->search($query, $folder);
    }

    public function find(string $id): ?MediaAsset
    {
        return $this->media->find($id);
    }

    public function upload(UploadedFile $file, string $folder, ?string $name = null): MediaAsset
    {
        $this->validateFile($file);

        $path = $file->store('media', 'public');
        $id = $this->generateId($name ?? $file->getClientOriginalName());

        return $this->media->create([
            'id' => $id,
            'name' => $name ?? $file->getClientOriginalName(),
            'path' => $path,
            'folder' => $folder,
            'type' => $file->getClientMimeType(),
            'size' => $file->getSize(),
        ]);
    }

    public function rename(MediaAsset $asset, string $name): MediaAsset
    {
        return $this->media->update($asset, ['name' => $name]);
    }

    public function move(MediaAsset $asset, string $folder): MediaAsset
    {
        return $this->media->update($asset, ['folder' => $folder]);
    }

    /** Replace the underlying file while keeping the asset's id (and therefore every reference to it) intact. */
    public function replaceFile(MediaAsset $asset, UploadedFile $file): MediaAsset
    {
        $this->validateFile($file);

        Storage::disk('public')->delete($asset->path);
        $path = $file->store('media', 'public');

        return $this->media->update($asset, [
            'path' => $path,
            'type' => $file->getClientMimeType(),
            'size' => $file->getSize(),
        ]);
    }

    public function delete(MediaAsset $asset): void
    {
        Storage::disk('public')->delete($asset->path);
        $this->media->delete($asset);
    }

    private function validateFile(UploadedFile $file): void
    {
        $isAccepted = in_array($file->getClientMimeType(), self::ACCEPTED_MIME_TYPES, true)
            || in_array(strtolower($file->getClientOriginalExtension()), ['jpg', 'jpeg', 'png', 'svg', 'webp'], true);

        if (! $isAccepted) {
            throw ValidationException::withMessages([
                'file' => "\"{$file->getClientOriginalName()}\" isn't a supported format. Use JPG, JPEG, PNG, SVG, or WebP.",
            ]);
        }

        if ($file->getSize() > self::MAX_SOURCE_BYTES) {
            throw ValidationException::withMessages([
                'file' => "\"{$file->getClientOriginalName()}\" is too large (max 15MB).",
            ]);
        }
    }

    private function generateId(string $name): string
    {
        $base = Str::slug(preg_replace('/\.[a-z0-9]+$/i', '', $name));
        $base = $base !== '' ? Str::limit($base, 40, '') : 'asset';

        return "{$base}-".Str::lower(Str::random(6));
    }
}
