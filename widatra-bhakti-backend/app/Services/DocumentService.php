<?php

namespace App\Services;

use App\Models\Document;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class DocumentService
{
    public function forUser(User $user): Collection
    {
        return $user->documents()->latest()->get();
    }

    public function upload(User $user, UploadedFile $file): Document
    {
        $path = $file->store("documents/{$user->id}", 'public');

        return Document::create([
            'user_id' => $user->id,
            'name' => $file->getClientOriginalName(),
            'path' => $path,
            'type' => $file->getClientMimeType(),
            'size' => $file->getSize(),
        ]);
    }

    public function delete(Document $document): void
    {
        Storage::disk('public')->delete($document->path);
        $document->delete();
    }
}
