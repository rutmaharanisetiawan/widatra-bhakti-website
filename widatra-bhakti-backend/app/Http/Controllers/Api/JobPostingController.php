<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreJobPostingRequest;
use App\Http\Requests\UpdateJobPostingRequest;
use App\Http\Resources\JobPostingResource;
use App\Models\JobPosting;
use App\Services\JobPostingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class JobPostingController extends Controller
{
    public function __construct(private JobPostingService $jobs) {}

    /** Public Careers listing — published only. Admin passes ?all=1 for the full list including drafts. */
    public function index(Request $request)
    {
        if ($request->boolean('all')) {
            // Public route (outside auth:sanctum) — resolve the token via
            // the sanctum guard explicitly so a logged-in admin is recognised.
            Gate::forUser($request->user('sanctum'))->authorize('manage-content');

            return JobPostingResource::collection($this->jobs->all());
        }

        return JobPostingResource::collection($this->jobs->published());
    }

    /** Public job detail page — published only. */
    public function show(string $slug)
    {
        $job = $this->jobs->findPublished($slug);
        abort_if(! $job, 404);

        return new JobPostingResource($job);
    }

    /** Admin — fetch any job (including drafts) by slug. */
    public function showAdmin(JobPosting $jobPosting)
    {
        $this->authorize('manage-content');

        return new JobPostingResource($jobPosting);
    }

    public function store(StoreJobPostingRequest $request)
    {
        $this->authorize('manage-content');
        $job = $this->jobs->create($request->validated());

        return new JobPostingResource($job);
    }

    public function update(UpdateJobPostingRequest $request, JobPosting $jobPosting)
    {
        $this->authorize('manage-content');
        $job = $this->jobs->update($jobPosting, $request->validated());

        return new JobPostingResource($job);
    }

    public function destroy(JobPosting $jobPosting)
    {
        $this->authorize('manage-content');
        $this->jobs->delete($jobPosting);

        return response()->json(['message' => 'Job posting deleted.']);
    }

    public function setStatus(Request $request, JobPosting $jobPosting)
    {
        $this->authorize('manage-content');
        $request->validate(['status' => 'required|in:Draft,Published']);
        $job = $this->jobs->setStatus($jobPosting, $request->input('status'));

        return new JobPostingResource($job);
    }

    public function setFeatured(Request $request, JobPosting $jobPosting)
    {
        $this->authorize('manage-content');
        $request->validate(['featured' => 'required|boolean']);
        $job = $this->jobs->setFeatured($jobPosting, $request->boolean('featured'));

        return new JobPostingResource($job);
    }
}