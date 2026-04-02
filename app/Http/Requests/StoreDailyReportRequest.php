<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDailyReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'contenu_texte' => ['nullable', 'string', 'max:5000'],
            'fichier'       => [
                'nullable',
                'file',
                'mimes:pdf,jpg,jpeg,png,txt',
                'max:10240', // 10 Mo maximum
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'fichier.mimes' => 'Seuls les fichiers PDF, JPG, PNG et TXT sont autorisés.',
            'fichier.max'   => 'Le fichier ne doit pas dépasser 10 Mo.',
        ];
    }
}
