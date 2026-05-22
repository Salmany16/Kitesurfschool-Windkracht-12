<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Lesson extends Model
{
    protected $fillable = [
        'booking_id',
        'instructor_id',
        'lesson_date',
        'timeslot',
        'status',
        'cancellation_reason',
        'cancellation_source',
        'cancellation_mail_sent',
    ];

    protected $casts = [
        'lesson_date' => 'date:Y-m-d',
        'cancellation_mail_sent' => 'boolean',
    ];

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    public function instructor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }
}
