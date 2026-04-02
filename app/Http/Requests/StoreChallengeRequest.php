<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreChallengeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->canChallenge();
    }

    public function rules(): array
    {
        return [
            'titre'       => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'duree_jours' => ['required', 'integer', 'min:1', 'max:365'],
            'date_debut'  => ['required', 'date', 'after_or_equal:today'],
        ];
    }

    public function messages(): array
    {
        return [
            'titre.required'       => 'Le titre est obligatoire.',
            'duree_jours.required' => 'La durée est obligatoire.',
            'duree_jours.min'      => 'La durée doit être d\'au moins 1 jour.',
            'duree_jours.max'      => 'La durée ne peut pas dépasser 365 jours.',
            'date_debut.required'  => 'La date de début est obligatoire.',
            'date_debut.after_or_equal' => 'La date de début doit être aujourd\'hui ou dans le futur.',
        ];
    }
}
