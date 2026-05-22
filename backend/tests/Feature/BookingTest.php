<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Package;
use App\Models\Booking;
use App\Models\Lesson;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BookingTest extends TestCase
{
    use RefreshDatabase;

    private $customer;
    private $instructor;
    private $privePackage;
    private $duoPackage;

    protected function setUp(): void
    {
        parent::setUp();

        // Create standard customer
        $this->customer = User::create([
            'email' => 'klant@windkracht12.nl',
            'role' => 'customer',
            'api_token' => 'customer_api_token_xyz',
        ]);

        // Create an instructor so the system has someone to assign
        $this->instructor = User::create([
            'email' => 'instructor@windkracht12.nl',
            'role' => 'instructor',
        ]);

        // Seed some test packages
        $this->privePackage = Package::create([
            'name' => 'Privéles 1 les',
            'duration_hours' => 2.5,
            'price' => 175.00,
            'max_persons' => 1,
            'lessons_count' => 1,
        ]);

        $this->duoPackage = Package::create([
            'name' => 'Duo lespakket 3 lessen',
            'duration_hours' => 10.5,
            'price' => 375.00,
            'max_persons' => 2,
            'lessons_count' => 3,
        ]);
    }

    /**
     * Happy Path: Create a standard single private booking.
     */
    public function test_create_booking_happy_path()
    {
        $response = $this->withHeader('Authorization', 'Bearer customer_api_token_xyz')
            ->postJson('/api/bookings', [
                'package_id' => $this->privePackage->id,
                'location' => 'Zandvoort',
                'lessons' => [
                    [
                        'date' => now()->addDays(2)->format('Y-m-d'),
                        'timeslot' => 'morning',
                    ]
                ]
            ]);

        $response->assertStatus(200);
        $response->assertJsonStructure(['message', 'booking']);
        
        $this->assertDatabaseHas('bookings', [
            'customer_id' => $this->customer->id,
            'package_id' => $this->privePackage->id,
            'location' => 'Zandvoort',
            'status' => 'voorlopig',
        ]);
    }

    /**
     * Unhappy Path: Try to book a package with the wrong number of lessons.
     */
    public function test_create_booking_unhappy_path_invalid_lessons_count()
    {
        // Duo package requires exactly 3 lessons, we send only 1
        $response = $this->withHeader('Authorization', 'Bearer customer_api_token_xyz')
            ->postJson('/api/bookings', [
                'package_id' => $this->duoPackage->id,
                'location' => 'Muiderberg',
                'lessons' => [
                    [
                        'date' => now()->addDays(2)->format('Y-m-d'),
                        'timeslot' => 'morning',
                    ]
                ]
            ]);

        $response->assertStatus(422);
        $response->assertJsonFragment([
            'message' => 'Voor dit pakket moet je precies 3 lesdatum(s) selecteren.'
        ]);
    }

    /**
     * Unhappy Path: Try to book a duo package without providing duo participant details.
     */
    public function test_create_booking_unhappy_path_duo_missing_details()
    {
        $response = $this->withHeader('Authorization', 'Bearer customer_api_token_xyz')
            ->postJson('/api/bookings', [
                'package_id' => $this->duoPackage->id,
                'location' => 'Scheveningen',
                'lessons' => [
                    [
                        'date' => now()->addDays(2)->format('Y-m-d'),
                        'timeslot' => 'morning',
                    ],
                    [
                        'date' => now()->addDays(3)->format('Y-m-d'),
                        'timeslot' => 'afternoon',
                    ],
                    [
                        'date' => now()->addDays(4)->format('Y-m-d'),
                        'timeslot' => 'morning',
                    ]
                ]
                // Missing duo_name, duo_address, duo_city
            ]);

        $response->assertStatus(422);
        $response->assertJsonFragment([
            'message' => 'Vul alstublieft de NAW-gegevens van de duo-deelnemer in.'
        ]);
    }
}
