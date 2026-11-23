<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreArticleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'slug' => ['nullable', 'string', 'alpha_dash', Rule::unique('articles', 'slug')],
            'cat' => ['required', Rule::in(['Corporate', 'People', 'Sustainability', 'Events'])],
            'date' => ['required', 'string'],
            'published_on' => ['nullable', 'date'],
            'read' => ['nullable', 'string'],
            'title' => ['required', 'string', 'max:255'],
            'excerpt' => ['required', 'string'],
            'img' => ['nullable', 'string'],
            'content' => ['required', 'string'],
            'gallery' => ['sometimes', 'array'],
            'tags' => ['sometimes', 'array'],
            'author' => ['nullable', 'string'],
            'author_role' => ['nullable', 'string'],
            'status' => ['required', Rule::in(['Published', 'Draft'])],
        ];
    }
}
