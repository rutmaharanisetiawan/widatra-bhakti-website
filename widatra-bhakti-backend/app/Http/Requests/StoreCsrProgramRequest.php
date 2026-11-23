<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCsrProgramRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'slug' => ['nullable', 'string', 'alpha_dash', Rule::unique('csr_programs', 'slug')],
            'pillar' => ['required', 'string'],
            'location' => ['required', 'string'],
            'date' => ['required', 'string'],
            'published_on' => ['nullable', 'date'],
            'title' => ['required', 'string', 'max:255'],
            'excerpt' => ['required', 'string'],
            'img' => ['nullable', 'string'],
            'content' => ['required', 'string'],
            'gallery' => ['sometimes', 'array'],
            'impact' => ['nullable', 'string'],
            'status' => ['required', Rule::in(['Published', 'Draft'])],
        ];
    }
}
