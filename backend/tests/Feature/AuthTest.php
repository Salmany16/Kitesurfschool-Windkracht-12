<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Happy Path: Register with a new, valid email address.
     */
    public function test_registration_happy_path()
    {
        $response = $this->postJson('/api/auth/register', [
            'email' => 'student@windkracht12.nl',
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure(['message', 'email']);
        $this->assertDatabaseHas('users', [
            'email' => 'student@windkracht12.nl',
            'role' => 'customer',
        ]);
    }

    /**
     * Unhappy Path: Register with a duplicate email address.
     */
    public function test_registration_unhappy_path_duplicate_email()
    {
        User::create([
            'email' => 'duplicate@windkracht12.nl',
            'role' => 'customer',
        ]);

        $response = $this->postJson('/api/auth/register', [
            'email' => 'duplicate@windkracht12.nl',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['email']);
    }

    /**
     * Unhappy Path: Register with an invalid email address format.
     */
    public function test_registration_unhappy_path_invalid_email()
    {
        $response = $this->postJson('/api/auth/register', [
            'email' => 'not-an-email',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['email']);
    }

    /**
     * Happy Path: Activate account using a valid token and a strong password.
     */
    public function test_activation_happy_path()
    {
        $user = User::create([
            'email' => 'kiter@windkracht12.nl',
            'role' => 'customer',
            'activation_token' => 'secure_test_token_123',
        ]);

        $response = $this->postJson('/api/auth/activate', [
            'token' => 'secure_test_token_123',
            'password' => 'Windkracht12!',
            'password_confirmation' => 'Windkracht12!',
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure(['message', 'token', 'user']);
        
        $user->refresh();
        $this->assertNull($user->activation_token);
        $this->assertNotNull($user->email_verified_at);
    }

    /**
     * Unhappy Path: Activate account with weak password (missing digit, uppercase, symbol, or too short).
     */
    public function test_activation_unhappy_path_weak_password()
    {
        User::create([
            'email' => 'kiter@windkracht12.nl',
            'role' => 'customer',
            'activation_token' => 'secure_test_token_123',
        ]);

        // Too short (less than 12 characters)
        $response = $this->postJson('/api/auth/activate', [
            'token' => 'secure_test_token_123',
            'password' => 'Short1!',
            'password_confirmation' => 'Short1!',
        ]);
        $response->assertStatus(422);
        $response->assertJsonFragment(['message' => 'Wachtwoord moet minimaal 12 tekens lang zijn.']);

        // Missing uppercase letter
        $response = $this->postJson('/api/auth/activate', [
            'token' => 'secure_test_token_123',
            'password' => 'no_uppercase_1!',
            'password_confirmation' => 'no_uppercase_1!',
        ]);
        $response->assertStatus(422);
        $response->assertJsonFragment(['message' => 'Wachtwoord moet minimaal één hoofdletter bevatten.']);

        // Missing digit
        $response = $this->postJson('/api/auth/activate', [
            'token' => 'secure_test_token_123',
            'password' => 'NoDigitHere!',
            'password_confirmation' => 'NoDigitHere!',
        ]);
        $response->assertStatus(422);
        $response->assertJsonFragment(['message' => 'Wachtwoord moet minimaal één cijfer bevatten.']);

        // Missing special character
        $response = $this->postJson('/api/auth/activate', [
            'token' => 'secure_test_token_123',
            'password' => 'NoSpecialChar123',
            'password_confirmation' => 'NoSpecialChar123',
        ]);
        $response->assertStatus(422);
        $response->assertJsonFragment(['message' => 'Wachtwoord moet minimaal één leesteken bevatten (bijv. @, #, !, ?).']);
    }
}
