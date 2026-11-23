<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SubmitApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'job_slug' => ['required', 'string', 'exists:job_postings,slug'],
            'job_title' => ['required', 'string'],
            'department' => ['required', 'string'],
            'location' => ['required', 'string'],
            'employment_type' => ['required', 'string'],
            'full_name' => ['required', 'string', 'max:255'],
            'dob' => ['required', 'date'],
            'gender' => ['required', 'string'],
            'email' => ['required', 'email'],
            'phone' => ['required', 'string'],
            'address' => ['required', 'string'],
            'city' => ['required', 'string'],
            'education' => ['sometimes', 'array'],
            'education.*.degree' => ['required_with:education', 'string'],
            'education.*.major' => ['required_with:education', 'string'],
            'education.*.institution' => ['required_with:education', 'string'],
            'education.*.year' => ['required_with:education', 'string'],
            'experience' => ['sometimes', 'array'],
            'experience.*.company' => ['required_with:experience', 'string'],
            'experience.*.role' => ['required_with:experience', 'string'],
            'experience.*.period' => ['required_with:experience', 'string'],
            'experience.*.description' => ['nullable', 'string'],
            'has_no_experience' => ['sometimes', 'boolean'],
            'skills' => ['nullable', 'string'],
            'linkedin' => ['nullable', 'url'],
            'portfolio' => ['nullable', 'url'],
            'cover_letter' => ['nullable', 'string'],
            'cv' => ['required', 'file', 'mimes:pdf,doc,docx', 'max:10240'],
        ];
    }
}
