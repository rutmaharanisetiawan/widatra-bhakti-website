<?php

namespace App\Http\Requests;

use App\Models\TourBooking;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTourStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => ['required', Rule::in(TourBooking::STATUSES)],
            'note' => ['nullable', 'string'],
        ];
    }
}
