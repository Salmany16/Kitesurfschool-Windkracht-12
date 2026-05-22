<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Package;
use App\Models\Location;
use App\Models\Photo;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminContentTest extends TestCase
{
    use RefreshDatabase;

    private $owner;

    protected function setUp(): void
    {
        parent::setUp();

        // Create an owner user
        $this->owner = User::create([
            'email' => 'owner@windkracht12.nl',
            'role' => 'owner',
            'api_token' => 'owner_api_token_abc',
        ]);
    }

    /**
     * --- PACKAGES TESTS ---
     */

    /**
     * Happy Path: Create, update, and delete a package as owner.
     */
    public function test_package_crud_happy_path()
    {
        // 1. Create Package
        $response = $this->withHeader('Authorization', 'Bearer owner_api_token_abc')
            ->postJson('/api/admin/packages', [
                'name' => 'Gevorderde Wave Rider 5 lessen',
                'duration_hours' => 12.5,
                'price' => 495.00,
                'max_persons' => 2,
                'lessons_count' => 5,
            ]);

        $response->assertStatus(210); // Custom success code from controller
        $response->assertJsonStructure(['message', 'package']);
        
        $this->assertDatabaseHas('packages', [
            'name' => 'Gevorderde Wave Rider 5 lessen',
            'price' => 495.00,
        ]);

        $packageId = $response->json('package.id');

        // 2. Update Package
        $updateResponse = $this->withHeader('Authorization', 'Bearer owner_api_token_abc')
            ->putJson("/api/admin/packages/{$packageId}", [
                'name' => 'Wave Rider Superieur 5 lessen',
                'duration_hours' => 13.0,
                'price' => 520.00,
                'max_persons' => 2,
                'lessons_count' => 5,
            ]);

        $updateResponse->assertStatus(200);
        $this->assertDatabaseHas('packages', [
            'id' => $packageId,
            'name' => 'Wave Rider Superieur 5 lessen',
            'price' => 520.00,
        ]);

        // 3. Delete Package
        $deleteResponse = $this->withHeader('Authorization', 'Bearer owner_api_token_abc')
            ->deleteJson("/api/admin/packages/{$packageId}");

        $deleteResponse->assertStatus(200);
        $this->assertDatabaseMissing('packages', [
            'id' => $packageId,
        ]);
    }

    /**
     * Unhappy Path: Try to create a package with negative price and missing fields.
     */
    public function test_create_package_unhappy_path_validation_fails()
    {
        $response = $this->withHeader('Authorization', 'Bearer owner_api_token_abc')
            ->postJson('/api/admin/packages', [
                'name' => '', // Empty name
                'duration_hours' => -10, // Negative duration
                'price' => -50, // Negative price
                'max_persons' => 0, // Less than 1
                'lessons_count' => -1, // Less than 1
            ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['name', 'duration_hours', 'price', 'max_persons', 'lessons_count']);
    }

    /**
     * --- LOCATIONS TESTS ---
     */

    /**
     * Happy Path: Create, update, and delete a location as owner.
     */
    public function test_location_crud_happy_path()
    {
        // 1. Create Location
        $response = $this->withHeader('Authorization', 'Bearer owner_api_token_abc')
            ->postJson('/api/admin/locations', [
                'name' => 'Scheveningen Zand',
                'difficulty' => 'advanced',
                'difficulty_label' => 'Gevorderd tot Expert',
                'water_type' => 'Hoge golven, sterke stroming',
                'wind_directions' => 'ZW, W, NW, N',
                'crowd_level' => 'Druk in de zomer',
                'description' => 'Mooie spot voor kiters die van uitdaging en golven houden.',
                'safety_tips' => 'Let op de sterke getijdenstroom en andere watersporters.',
                'icon' => '🌊',
            ]);

        $response->assertStatus(210);
        $response->assertJsonStructure(['message', 'location']);

        $this->assertDatabaseHas('locations', [
            'name' => 'Scheveningen Zand',
            'difficulty' => 'advanced',
        ]);

        $locationId = $response->json('location.id');

        // 2. Update Location
        $updateResponse = $this->withHeader('Authorization', 'Bearer owner_api_token_abc')
            ->putJson("/api/admin/locations/{$locationId}", [
                'name' => 'Scheveningen Pier',
                'difficulty' => 'advanced',
                'difficulty_label' => 'Expert Only',
                'water_type' => 'Zeer sterke stroming rond de pier',
                'wind_directions' => 'ZW, W, NW',
                'crowd_level' => 'Matig druk',
                'description' => 'Alleen geschikt voor zeer ervaren kitesurfers.',
                'safety_tips' => 'Blijf minimaal 100 meter uit de buurt van de constructie.',
                'icon' => '🏄‍♂️',
            ]);

        $updateResponse->assertStatus(200);
        $this->assertDatabaseHas('locations', [
            'id' => $locationId,
            'name' => 'Scheveningen Pier',
            'difficulty' => 'advanced',
        ]);

        // 3. Delete Location
        $deleteResponse = $this->withHeader('Authorization', 'Bearer owner_api_token_abc')
            ->deleteJson("/api/admin/locations/{$locationId}");

        $deleteResponse->assertStatus(200);
        $this->assertDatabaseMissing('locations', [
            'id' => $locationId,
        ]);
    }

    /**
     * Unhappy Path: Try to create a location with a duplicate name.
     */
    public function test_location_unhappy_path_duplicate_name()
    {
        // Pre-create one location
        Location::create([
            'name' => 'Brouwersdam',
            'difficulty' => 'beginner',
            'difficulty_label' => 'Ideaal voor beginners',
            'water_type' => 'Vlak en ondiep water',
            'wind_directions' => 'Alle richtingen',
            'crowd_level' => 'Zeer populair',
            'description' => 'De bekendste kitespot van Nederland.',
            'safety_tips' => 'Houd rekening met zwemmers.',
            'icon' => '🌟',
        ]);

        // Try to create another location with the same name
        $response = $this->withHeader('Authorization', 'Bearer owner_api_token_abc')
            ->postJson('/api/admin/locations', [
                'name' => 'Brouwersdam', // Duplicate
                'difficulty' => 'intermediate',
                'difficulty_label' => 'Gevorderd',
                'water_type' => 'Vlak water',
                'wind_directions' => 'ZW, W',
                'crowd_level' => 'Rustig',
                'description' => 'Test beschrijving.',
                'safety_tips' => 'Test veiligheid.',
                'icon' => '🌊',
            ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['name']);
    }

    /**
     * --- PHOTOS TESTS ---
     */

    /**
     * Happy Path: Add, update, and delete a photo in the gallery.
     */
    public function test_photo_crud_happy_path()
    {
        // 1. Create Photo
        $response = $this->withHeader('Authorization', 'Bearer owner_api_token_abc')
            ->postJson('/api/admin/photos', [
                'title' => 'Sunset Big Air',
                'spot' => 'Workum',
                'kiter' => 'Terence Olieslager',
                'wind' => '24 knopen',
                'gear' => 'Ozone Edge 10m',
                'description' => 'Een spectaculaire sprong tijdens zonsondergang op het IJsselmeer.',
                'img_url' => 'http://example.com/photos/sunset.jpg',
            ]);

        $response->assertStatus(210);
        $response->assertJsonStructure(['message', 'photo']);

        $this->assertDatabaseHas('photos', [
            'title' => 'Sunset Big Air',
            'spot' => 'Workum',
        ]);

        $photoId = $response->json('photo.id');

        // 2. Update Photo (switch to gradient placeholder representation)
        $updateResponse = $this->withHeader('Authorization', 'Bearer owner_api_token_abc')
            ->putJson("/api/admin/photos/{$photoId}", [
                'title' => 'Sunset Big Air Updated',
                'spot' => 'Workum',
                'kiter' => 'Terence Olieslager',
                'wind' => '24 knopen',
                'gear' => 'Ozone Edge 10m',
                'description' => 'Bijgewerkte omschrijving.',
                'gradient' => 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
                'icon' => '🌅',
            ]);

        $updateResponse->assertStatus(200);
        $this->assertDatabaseHas('photos', [
            'id' => $photoId,
            'title' => 'Sunset Big Air Updated',
            'icon' => '🌅',
        ]);

        // 3. Delete Photo
        $deleteResponse = $this->withHeader('Authorization', 'Bearer owner_api_token_abc')
            ->deleteJson("/api/admin/photos/{$photoId}");

        $deleteResponse->assertStatus(200);
        $this->assertDatabaseMissing('photos', [
            'id' => $photoId,
        ]);
    }

    /**
     * Unhappy Path: Try to create a photo without both img_url and gradient placeholder.
     */
    public function test_photo_unhappy_path_missing_visualization_source()
    {
        $response = $this->withHeader('Authorization', 'Bearer owner_api_token_abc')
            ->postJson('/api/admin/photos', [
                'title' => 'Geen Afbeelding Test',
                'spot' => 'Zandvoort',
                'kiter' => 'Onbekend',
                'wind' => '15 knopen',
                'gear' => 'Flysurfer 12m',
                'description' => 'Dit moet mislukken omdat er geen afbeelding en geen gradient is opgegeven.',
                // Missing img_url, gradient, and icon
            ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['img_url', 'gradient', 'icon']);
    }
}
