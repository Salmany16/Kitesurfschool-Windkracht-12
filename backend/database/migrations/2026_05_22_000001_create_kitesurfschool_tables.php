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
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('name')->nullable();
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->date('birthdate')->nullable();
            $table->string('bsn_number')->nullable();
            $table->string('mobile_number')->nullable();
            $table->timestamps();
        });

        Schema::create('packages', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->decimal('duration_hours', 5, 2);
            $table->decimal('price', 8, 2);
            $table->integer('max_persons');
            $table->integer('lessons_count');
            $table->timestamps();
        });

        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('package_id')->constrained('packages')->onDelete('cascade');
            $table->string('location');
            $table->string('status')->default('voorlopig'); // 'voorlopig', 'definitief'
            $table->boolean('customer_marked_paid')->default(false);
            $table->string('duo_name')->nullable();
            $table->string('duo_address')->nullable();
            $table->string('duo_city')->nullable();
            $table->timestamps();
        });

        Schema::create('lessons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained('bookings')->onDelete('cascade');
            $table->foreignId('instructor_id')->nullable()->constrained('users')->onDelete('set null');
            $table->date('lesson_date');
            $table->string('timeslot')->default('morning'); // 'morning', 'afternoon'
            $table->string('status')->default('scheduled'); // 'scheduled', 'cancelled'
            $table->text('cancellation_reason')->nullable();
            $table->string('cancellation_source')->nullable(); // 'customer', 'instructor', 'owner'
            $table->boolean('cancellation_mail_sent')->default(false);
            $table->timestamps();
        });

        Schema::create('simulated_emails', function (Blueprint $table) {
            $table->id();
            $table->string('to_email');
            $table->string('subject');
            $table->longText('body');
            $table->timestamp('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('simulated_emails');
        Schema::dropIfExists('lessons');
        Schema::dropIfExists('bookings');
        Schema::dropIfExists('packages');
        Schema::dropIfExists('profiles');
    }
};
