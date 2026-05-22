<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Photo extends Model
{
    protected $fillable = [
        'title',
        'spot',
        'kiter',
        'wind',
        'gear',
        'description',
        'img_url',
        'gradient',
        'icon',
    ];
}
