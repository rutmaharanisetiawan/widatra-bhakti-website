<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UploadMediaRequest;
use App\Http\Resources\MediaAssetResource;
use App\Models\MediaAsset;
use App\Services\MediaService;
use Illuminate\Http\Request;

class MediaAssetController extends Controller
{
    public function __construct(private MediaService $media) {}

    public function index(Request $request)
    {
        // Read-only listing is public: product/news/CSR pages on the public
        // site resolve image URLs through this endpoint for anonymous
        // visitors. Only create/rename/move/replace/delete require auth.
        $folder = $request->query('folder', 'All');
        $query = $request->query('q', '');

        $assets = $query !== ''
            ? $this->media->search($query, $folder === 'All' ? null : $folder)
            : $this->media->byFolder($folder);

        return MediaAssetResource::collection($assets);
    }

    public function store(UploadMediaRequest $request)
    {
        $this->authorize('manage-content');
        $asset = $this->media->upload($request->file('file'), $request->input('folder'), $request->input('name'));

        return new MediaAssetResource($asset);
    }

    public function rename(Request $request, MediaAsset $mediaAsset)
    {
        $this->authorize('manage-content');
        $request->validate(['name' => 'required|string|max:255']);
        $asset = $this->media->rename($mediaAsset, $request->input('name'));

        return new MediaAssetResource($asset);
    }

    public function move(Request $request, MediaAsset $mediaAsset)
    {
        $this->authorize('manage-content');
        $request->validate(['folder' => 'required|in:'.implode(',', MediaAsset::FOLDERS)]);
        $asset = $this->media->move($mediaAsset, $request->input('folder'));

        return new MediaAssetResource($asset);
    }

    public function replace(Request $request, MediaAsset $mediaAsset)
    {
        $this->authorize('manage-content');
        $request->validate(['file' => 'required|file|max:15360']);
        $asset = $this->media->replaceFile($mediaAsset, $request->file('file'));

        return new MediaAssetResource($asset);
    }

    public function destroy(MediaAsset $mediaAsset)
    {
        $this->authorize('manage-content');
        $this->media->delete($mediaAsset);

        return response()->json(['message' => 'Asset deleted.']);
    }
}