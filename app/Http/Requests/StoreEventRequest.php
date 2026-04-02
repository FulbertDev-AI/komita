<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isProfesseur();
    }

    public function rules(): array
    {
        return [
            'titre'       => ['required', 'string', 'max:255'],
            'consigne'    => ['required', 'string', 'max:5000'],
            'date_limite' => ['required', 'date', 'after:now'],
        ];
    }

    public function messages(): array
    {
        return [
            'titre.required'       => 'Le titre est obligatoire.',
            'consigne.required'    => 'La consigne est obligatoire.',
            'date_limite.required' => 'La date limite est obligatoire.',
            'date_limite.after'    => 'La date limite doit être dans le futur.',
        ];
    }
}
