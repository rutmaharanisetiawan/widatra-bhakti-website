<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SaveCompanyProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'hero_image' => ['nullable', 'string'],
            'facility_gallery' => ['nullable', 'array'],
            'leadership_photos' => ['nullable', 'array'],
        ];
    }
}
