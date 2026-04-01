<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EventElementFile extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_element_id',
        'file_path',
        'file_mime',
        'original_name',
        'file_size',
    ];

    public function element(): BelongsTo
    {
        return $this->belongsTo(EventElement::class, 'event_element_id');
    }
}
