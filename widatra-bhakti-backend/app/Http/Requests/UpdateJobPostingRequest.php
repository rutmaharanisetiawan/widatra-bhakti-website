<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateJobPostingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'department' => ['required', Rule::in(['Production', 'Quality', 'R&D', 'Engineering', 'Supply Chain', 'Corporate', 'Sales & Marketing'])],
            'location' => ['required', 'string'],
            'work_mode' => ['required', Rule::in(['On-site', 'Hybrid', 'Remote'])],
            'employment_type' => ['required', Rule::in(['Full-time', 'Contract', 'Internship'])],
            'level' => ['required', Rule::in(['Entry', 'Mid', 'Senior', 'Lead'])],
            'salary' => ['nullable', 'string'],
            'deadline' => ['required', 'date'],
            'posted' => ['required', 'date'],
            'summary' => ['required', 'string'],
            'description' => ['required', 'string'],
            'responsibilities' => ['required', 'array'],
            'qualifications' => ['required', 'array'],
            'requirements' => ['required', 'array'],
            'benefits' => ['required', 'array'],
            'status' => ['required', Rule::in(['Draft', 'Published'])],
            'featured' => ['sometimes', 'boolean'],
            'cover_image' => ['nullable', 'string'],
        ];
    }
}
