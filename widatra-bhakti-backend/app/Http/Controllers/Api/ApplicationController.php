<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AddNoteRequest;
use App\Http\Requests\ScheduleInterviewRequest;
use App\Http\Requests\SubmitApplicationRequest;
use App\Http\Requests\UpdateApplicationStatusRequest;
use App\Http\Resources\ApplicationResource;
use App\Models\Application;
use App\Services\ApplicationService;
use Illuminate\Http\Request;

class ApplicationController extends Controller
{
    public function __construct(private ApplicationService $applications) {}

    /** Admin/HR — every application across all applicants. */
    public function index(Request $request)
    {
        $this->authorize('manageAny', Application::class);

        return ApplicationResource::collection($this->applications->all());
    }

    /** Applicant — "My Job Applications", scoped to the signed-in user. */
    public function mine(Request $request)
    {
        return ApplicationResource::collection($this->applications->forUser($request->user()));
    }

    public function show(Request $request, Application $application)
    {
        $this->authorize('view', $application);

        return new ApplicationResource($application);
    }

    /** Applicant submits a new application for a published job, with CV upload. */
    public function store(SubmitApplicationRequest $request)
    {
        $this->authorize('create', Application::class);
        $application = $this->applications->submit($request->user(), $request->validated(), $request->file('cv'));

        return new ApplicationResource($application);
    }

    /** HR — move an application through the pipeline (Submitted → Screening → ... → Hired/Rejected). */
    public function updateStatus(UpdateApplicationStatusRequest $request, Application $application)
    {
        $this->authorize('update', $application);
        $application = $this->applications->updateStatus($application, $request->input('status'), $request->input('note'));

        return new ApplicationResource($application);
    }

    /** HR — the only path that transitions status to "Interview". */
    public function scheduleInterview(ScheduleInterviewRequest $request, Application $application)
    {
        $this->authorize('update', $application);
        $application = $this->applications->scheduleInterview($application, $request->validated());

        return new ApplicationResource($application);
    }

    public function updateInterview(ScheduleInterviewRequest $request, Application $application)
    {
        $this->authorize('update', $application);
        $application = $this->applications->updateInterview($application, $request->validated());

        return new ApplicationResource($application);
    }

    public function cancelInterview(Request $request, Application $application)
    {
        $this->authorize('update', $application);
        $application = $this->applications->cancelInterview($application, $request->input('note'));

        return new ApplicationResource($application);
    }

    public function addHrNote(AddNoteRequest $request, Application $application)
    {
        $this->authorize('update', $application);
        $application = $this->applications->addHrNote($application, $request->input('note'), $request->user());

        return new ApplicationResource($application);
    }
}
