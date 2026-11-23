<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SaveFactoryTourContentRequest;
use App\Http\Resources\FactoryTourContentResource;
use App\Services\FactoryTourContentService;

class FactoryTourContentController extends Controller
{
    public function __construct(private FactoryTourContentService $content) {}

    /** Public — imagery shown on the /factory-tour page. */
    public function show()
    {
        return new FactoryTourContentResource($this->content->get());
    }

    public function update(SaveFactoryTourContentRequest $request)
    {
        $this->authorize('manage-content');
        $content = $this->content->save($request->validated());

        return new FactoryTourContentResource($content);
    }
}
