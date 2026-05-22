<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    protected $fillable = [
        'name',
        'difficulty',
        'difficulty_label',
        'water_type',
        'wind_directions',
        'crowd_level',
        'description',
        'safety_tips',
        'icon',
    ];
}
