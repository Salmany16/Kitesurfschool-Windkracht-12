<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('locations', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('difficulty');
            $table->string('difficulty_label');
            $table->string('water_type');
            $table->string('wind_directions');
            $table->string('crowd_level');
            $table->text('description');
            $table->text('safety_tips');
            $table->string('icon');
            $table->timestamps();
        });

        Schema::create('photos', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('spot');
            $table->string('kiter');
            $table->string('wind');
            $table->string('gear');
            $table->text('description');
            $table->string('img_url')->nullable();
            $table->string('gradient')->nullable();
            $table->string('icon')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('photos');
        Schema::dropIfExists('locations');
    }
};
