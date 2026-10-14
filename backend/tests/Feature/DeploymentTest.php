<?php

namespace Tests\Feature;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class DeploymentTest extends TestCase
{
    public function test_proxy_https_header_is_recognized(): void
    {
        Route::get('/test-proxy', fn (Request $request) => response()->json(['secure' => $request->isSecure()]));

        $this->withServerVariables(['REMOTE_ADDR' => '10.0.0.1'])
            ->withHeaders(['X-Forwarded-Proto' => 'https'])
            ->getJson('/test-proxy')->assertOk()->assertJsonPath('secure', true);
    }

    public function test_health_endpoint_is_available(): void
    {
        $this->get('/up')->assertOk();
    }

    public function test_health_endpoint_reports_a_database_failure(): void
    {
        DB::shouldReceive('connection')->once()->andThrow(new \RuntimeException('Database unavailable.'));

        $this->get('/up')->assertStatus(500);
    }

    public function test_unknown_origin_is_not_allowed_by_cors(): void
    {
        $this->withHeaders([
            'Origin' => 'https://untrusted.example.com',
            'Access-Control-Request-Method' => 'POST',
        ])->options('/api/tickets')->assertHeaderMissing('Access-Control-Allow-Origin');
    }
}
