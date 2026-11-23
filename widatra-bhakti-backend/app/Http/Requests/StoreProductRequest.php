<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'code' => ['nullable', 'string', 'alpha_dash', Rule::unique('products', 'code')],
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', Rule::in(['Basic Intravenous', 'Specialty Solution', 'Irrigation', 'Medical Device'])],
            'brand' => ['required', Rule::in(['Generic', 'Branded'])],
            'osmolarity' => ['nullable', 'string'],
            'calorie' => ['nullable', 'string'],
            'nie' => ['nullable', 'string'],
            'packaging' => ['required', 'array'],
            'sizes' => ['required', 'array'],
            'indication' => ['required', 'string'],
            'benefits' => ['required', 'array'],
            'applications' => ['required', 'array'],
            'storage' => ['required', 'string'],
            'shelf_life' => ['required', 'string'],
            'composition' => ['required', 'string'],
            'manufacturing_note' => ['nullable', 'string'],
            'img' => ['nullable', 'string'],
            'tagline' => ['nullable', 'string'],
        ];
    }
}
