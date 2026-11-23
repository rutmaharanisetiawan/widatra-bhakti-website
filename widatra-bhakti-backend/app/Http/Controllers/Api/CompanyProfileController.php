<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SaveCompanyProfileRequest;
use App\Http\Resources\CompanyProfileResource;
use App\Services\CompanyProfileService;

class CompanyProfileController extends Controller
{
    public function __construct(private CompanyProfileService $profile) {}

    /** Public — imagery shown on the /about page. */
    public function show()
    {
        return new CompanyProfileResource($this->profile->get());
    }

    public function update(SaveCompanyProfileRequest $request)
    {
        $this->authorize('manage-content');
        $profile = $this->profile->save($request->validated());

        return new CompanyProfileResource($profile);
    }
}
