<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCommunityEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'community' => ['required', 'string'],
            'category' => ['required', 'string'],
            'event_date' => ['required', 'date'],
            'location' => ['required', 'string'],
            'summary' => ['required', 'string'],
            'description' => ['required', 'string'],
            'cover_image' => ['nullable', 'string'],
            'gallery' => ['sometimes', 'array'],
            'gallery.*' => ['string'],
            'tags' => ['sometimes', 'array'],
            'tags.*' => ['string'],
            'contact_person' => ['nullable', 'string'],
            'contact_phone' => ['nullable', 'string'],
            'agreement_accepted' => ['required', 'boolean'],
        ];
    }
}
