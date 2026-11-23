<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\DocumentResource;
use App\Models\Document;
use App\Services\DocumentService;
use Illuminate\Http\Request;

class DocumentController extends Controller
{
    public function __construct(private DocumentService $documents) {}

    public function index(Request $request)
    {
        return DocumentResource::collection($this->documents->forUser($request->user()));
    }

    public function store(Request $request)
    {
        $request->validate(['file' => 'required|file|max:20480']);
        $document = $this->documents->upload($request->user(), $request->file('file'));

        return new DocumentResource($document);
    }

    public function destroy(Request $request, Document $document)
    {
        abort_unless($document->user_id === $request->user()->id, 403);
        $this->documents->delete($document);

        return response()->json(['message' => 'Document deleted.']);
    }
}
