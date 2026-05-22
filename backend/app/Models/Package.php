<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Package extends Model
{
    protected $fillable = [
        'name',
        'duration_hours',
        'price',
        'max_persons',
        'lessons_count',
    ];

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }
}
