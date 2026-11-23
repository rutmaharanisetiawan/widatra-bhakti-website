<?php

namespace App\Http\Requests;

use App\Models\MediaAsset;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UploadMediaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'file' => ['required', 'file', 'max:15360'],
            'folder' => ['required', Rule::in(MediaAsset::FOLDERS)],
            'name' => ['nullable', 'string', 'max:255'],
        ];
    }
}
