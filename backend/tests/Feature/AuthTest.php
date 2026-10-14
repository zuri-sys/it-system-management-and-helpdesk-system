<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\AdminUserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\PersonalAccessToken;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_all_ticket_routes_require_authentication(): void
    {
        $this->getJson('/api/tickets')->assertUnauthorized();
        $this->postJson('/api/tickets', [])->assertUnauthorized();
        $this->getJson('/api/tickets/1')->assertUnauthorized();
        $this->putJson('/api/tickets/1', [])->assertUnauthorized();
        $this->deleteJson('/api/tickets/1')->assertUnauthorized();
        $this->getJson('/api/auth/me')->assertUnauthorized();
        $this->postJson('/api/auth/logout')->assertUnauthorized();
    }

    public function test_login_issues_a_hashed_expiring_token_and_logout_revokes_it(): void
    {
        User::factory()->create(['username' => 'itadmin', 'password' => 'helpdesk123']);
        $response = $this->postJson('/api/auth/login', ['username' => 'itadmin', 'password' => 'helpdesk123'])
            ->assertOk()->assertJsonPath('user.username', 'itadmin')->assertJsonMissingPath('user.password');
        $token = $response->json('token');
        $storedToken = PersonalAccessToken::first();
        $this->assertNotEquals($token, $storedToken->token);
        $this->assertTrue($storedToken->expires_at->isFuture());
        $this->withToken($token)->getJson('/api/auth/me')->assertOk();
        $this->withToken($token)->getJson('/api/tickets')->assertOk();
        $this->withToken($token)->postJson('/api/auth/logout')->assertNoContent();
        $this->assertDatabaseCount('personal_access_tokens', 0);
        $this->app['auth']->forgetGuards();
        $this->withToken($token)->getJson('/api/tickets')->assertUnauthorized();
    }

    public function test_invalid_login_does_not_create_tokens(): void
    {
        User::factory()->create(['username' => 'itadmin', 'password' => 'helpdesk123']);
        $this->postJson('/api/auth/login', ['username' => 'itadmin', 'password' => 'wrong'])
            ->assertUnprocessable()->assertJsonValidationErrors('username');
        $this->postJson('/api/auth/login', [])->assertUnprocessable()->assertJsonValidationErrors(['username', 'password']);
        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_expired_and_forged_tokens_are_rejected(): void
    {
        $user = User::factory()->create();
        $expired = $user->createToken('expired', ['*'], now()->subMinute())->plainTextToken;
        $this->withToken($expired)->getJson('/api/tickets')->assertUnauthorized();
        $this->app['auth']->forgetGuards();
        $this->withToken('invalid-token')->getJson('/api/tickets')->assertUnauthorized();
    }

    public function test_login_attempts_are_rate_limited(): void
    {
        for ($attempt = 0; $attempt < 5; $attempt++) {
            $this->postJson('/api/auth/login', ['username' => 'missing', 'password' => 'wrong'])->assertUnprocessable();
        }
        $this->postJson('/api/auth/login', ['username' => 'missing', 'password' => 'wrong'])->assertStatus(429);
    }

    public function test_admin_seed_does_not_overwrite_an_existing_password(): void
    {
        config(['helpdesk.admin_username' => 'itadmin', 'helpdesk.admin_email' => 'admin@example.com', 'helpdesk.admin_password' => 'helpdesk123']);
        $this->seed(AdminUserSeeder::class);
        $user = User::where('username', 'itadmin')->firstOrFail();
        $this->assertTrue(Hash::check('helpdesk123', $user->password));
        $user->update(['password' => 'changed-password']);
        $this->seed(AdminUserSeeder::class);
        $this->assertTrue(Hash::check('changed-password', $user->fresh()->password));
        $this->assertDatabaseCount('users', 1);
    }

    public function test_hardcoded_credentials_can_log_in_with_production_settings(): void
    {
        $this->app->detectEnvironment(fn (): string => 'production');
        $this->artisan('db:seed', ['--class' => AdminUserSeeder::class, '--force' => true])->assertExitCode(0);

        $this->postJson('/api/auth/login', ['username' => 'itadmin', 'password' => 'helpdesk123'])
            ->assertOk()->assertJsonPath('user.username', 'itadmin');
        $this->assertTrue(Hash::check('helpdesk123', User::where('username', 'itadmin')->firstOrFail()->password));
    }
}
