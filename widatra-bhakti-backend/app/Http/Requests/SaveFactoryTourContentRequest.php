<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SaveFactoryTourContentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'hero_image' => ['nullable', 'string'],
            'gallery' => ['nullable', 'array'],
        ];
    }
}
