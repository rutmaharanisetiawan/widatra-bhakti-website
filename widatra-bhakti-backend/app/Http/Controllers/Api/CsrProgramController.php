<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SetStatusRequest;
use App\Http\Requests\StoreCsrProgramRequest;
use App\Http\Requests\UpdateCsrProgramRequest;
use App\Http\Resources\CsrProgramResource;
use App\Models\CsrProgram;
use App\Services\CsrProgramService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class CsrProgramController extends Controller
{
    public function __construct(private CsrProgramService $programs) {}

    public function index(Request $request)
    {
        if ($request->boolean('all')) {
            // Public route (outside auth:sanctum) — resolve the token via
            // the sanctum guard explicitly so a logged-in admin is recognised.
            Gate::forUser($request->user('sanctum'))->authorize('manage-content');

            return CsrProgramResource::collection($this->programs->all());
        }

        return CsrProgramResource::collection($this->programs->published());
    }

    public function show(string $slug)
    {
        $program = $this->programs->findPublished($slug);
        abort_if(! $program, 404);

        return new CsrProgramResource($program);
    }

    public function showAdmin(CsrProgram $csrProgram)
    {
        $this->authorize('manage-content');

        return new CsrProgramResource($csrProgram);
    }

    public function store(StoreCsrProgramRequest $request)
    {
        $this->authorize('manage-content');
        $program = $this->programs->create($request->validated());

        return new CsrProgramResource($program);
    }

    public function update(UpdateCsrProgramRequest $request, CsrProgram $csrProgram)
    {
        $this->authorize('manage-content');
        $program = $this->programs->update($csrProgram, $request->validated());

        return new CsrProgramResource($program);
    }

    public function destroy(CsrProgram $csrProgram)
    {
        $this->authorize('manage-content');
        $this->programs->delete($csrProgram);

        return response()->json(['message' => 'CSR program deleted.']);
    }

    public function setStatus(SetStatusRequest $request, CsrProgram $csrProgram)
    {
        $this->authorize('manage-content');
        $program = $this->programs->setStatus($csrProgram, $request->input('status'));

        return new CsrProgramResource($program);
    }
}