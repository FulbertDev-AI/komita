<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EventElement extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_id',
        'author_id',
        'title',
        'content',
        'file_path',
        'file_mime',
        'publish_date',
    ];

    protected function casts(): array
    {
        return [
            'publish_date' => 'date',
        ];
    }

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function files(): HasMany
    {
        return $this->hasMany(EventElementFile::class, 'event_element_id');
    }
}
