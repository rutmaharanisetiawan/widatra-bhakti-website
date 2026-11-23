<?php

namespace App\Repositories\Eloquent;

use App\Models\MediaAsset;
use App\Repositories\Contracts\MediaAssetRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class MediaAssetRepository implements MediaAssetRepositoryInterface
{
    public function all(): Collection
    {
        return MediaAsset::orderByDesc('created_at')->get();
    }

    public function byFolder(string $folder): Collection
    {
        if ($folder === 'All') {
            return $this->all();
        }

        return MediaAsset::where('folder', $folder)->orderByDesc('created_at')->get();
    }

    public function search(string $query, ?string $folder = null): Collection
    {
        $scoped = $folder ? $this->byFolder($folder) : $this->all();
        $q = trim(strtolower($query));
        if ($q === '') {
            return $scoped;
        }

        return $scoped->filter(fn ($asset) => str_contains(strtolower($asset->name), $q))->values();
    }

    public function find(string $id): ?MediaAsset
    {
        return MediaAsset::find($id);
    }

    public function create(array $data): MediaAsset
    {
        return MediaAsset::create($data);
    }

    public function update(MediaAsset $asset, array $data): MediaAsset
    {
        $asset->update($data);

        return $asset->refresh();
    }

    public function delete(MediaAsset $asset): void
    {
        $asset->delete();
    }
}
