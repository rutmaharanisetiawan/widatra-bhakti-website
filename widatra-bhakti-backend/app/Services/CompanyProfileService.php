<?php

namespace App\Services;

use App\Models\CompanyProfile;

class CompanyProfileService
{
    public function get(): CompanyProfile
    {
        return CompanyProfile::current();
    }

    public function save(array $data): CompanyProfile
    {
        $profile = CompanyProfile::current();
        $profile->update([
            'hero_image' => $data['hero_image'] ?? $profile->hero_image,
            'facility_gallery' => $data['facility_gallery'] ?? $profile->facility_gallery,
            'leadership_photos' => $data['leadership_photos'] ?? $profile->leadership_photos,
        ]);

        return $profile;
    }
}
