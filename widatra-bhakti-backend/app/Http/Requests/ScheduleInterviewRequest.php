<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ScheduleInterviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'date' => ['required', 'date'],
            'time' => ['required', 'string'],
            'type' => ['required', Rule::in(['Online', 'Offline'])],
            'location_or_link' => ['required', 'string'],
            'interviewer' => ['required', 'string'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
