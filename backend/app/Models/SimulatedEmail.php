<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SimulatedEmail extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'to_email',
        'subject',
        'body',
        'created_at',
    ];
}
