<?php

namespace App\Repositories\Contracts;

use App\Models\MediaAsset;
use Illuminate\Database\Eloquent\Collection;

interface MediaAssetRepositoryInterface
{
    public function all(): Collection;

    public function byFolder(string $folder): Collection;

    public function search(string $query, ?string $folder = null): Collection;

    public function find(string $id): ?MediaAsset;

    public function create(array $data): MediaAsset;

    public function update(MediaAsset $asset, array $data): MediaAsset;

    public function delete(MediaAsset $asset): void;
}
