<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TicketTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Sanctum::actingAs(User::factory()->create());
    }

    private function ticketData(): array
    {
        return [
            'requester_name' => 'Test User',
            'requester_email' => 'test@example.com',
            'category' => 'Network',
            'priority' => 'High',
            'subject' => 'Cannot connect',
            'description' => 'The office computer cannot connect to the network.',
        ];
    }

    public function test_ticket_crud_is_persisted(): void
    {
        $created = $this->postJson('/api/tickets', $this->ticketData())
            ->assertCreated()->assertJsonPath('status', 'Open');
        $id = $created->json('id');
        $created->assertJsonPath('ticket_number', 'TKT-'.str_pad((string) $id, 6, '0', STR_PAD_LEFT));
        $this->assertDatabaseHas('tickets', ['id' => $id, 'subject' => 'Cannot connect']);
        $this->getJson('/api/tickets')->assertOk()->assertJsonCount(1);
        $this->getJson('/api/tickets/'.$id)->assertOk()->assertJsonPath('requester_email', 'test@example.com');
        $this->putJson('/api/tickets/'.$id, [...$this->ticketData(), 'status' => 'Resolved'])
            ->assertOk()->assertJsonPath('status', 'Resolved');
        $this->assertDatabaseHas('tickets', ['id' => $id, 'status' => 'Resolved']);
        $this->deleteJson('/api/tickets/'.$id)->assertNoContent();
        $this->assertDatabaseMissing('tickets', ['id' => $id]);
        $this->getJson('/api/tickets/'.$id)->assertNotFound();
    }

    public function test_invalid_tickets_are_rejected(): void
    {
        $this->postJson('/api/tickets', [])->assertUnprocessable()
            ->assertJsonValidationErrors(['requester_name', 'requester_email', 'category', 'priority', 'subject', 'description']);
        $this->postJson('/api/tickets', [...$this->ticketData(), 'requester_email' => 'invalid', 'priority' => 'Unknown'])
            ->assertUnprocessable()->assertJsonValidationErrors(['requester_email', 'priority']);
        $this->assertDatabaseCount('tickets', 0);
    }

    public function test_invalid_update_keeps_existing_ticket_data(): void
    {
        $id = $this->postJson('/api/tickets', $this->ticketData())->json('id');
        $this->putJson('/api/tickets/'.$id, [...$this->ticketData(), 'status' => 'Unknown', 'subject' => str_repeat('a', 256)])
            ->assertUnprocessable()->assertJsonValidationErrors(['status', 'subject']);
        $this->assertDatabaseHas('tickets', ['id' => $id, 'status' => 'Open', 'subject' => 'Cannot connect']);
    }

    public function test_new_tickets_start_open_and_ignore_extra_fields(): void
    {
        $this->postJson('/api/tickets', [...$this->ticketData(), 'status' => 'Closed', 'id' => 999])
            ->assertCreated()->assertJsonPath('status', 'Open');
        $this->assertDatabaseMissing('tickets', ['id' => 999]);
    }

    public function test_frontend_origin_can_make_cross_origin_requests(): void
    {
        $this->withHeaders([
            'Origin' => 'http://localhost:5174',
            'Access-Control-Request-Method' => 'POST',
            'Access-Control-Request-Headers' => 'content-type',
        ])->options('/api/tickets')->assertSuccessful()
            ->assertHeader('Access-Control-Allow-Origin', 'http://localhost:5174');
    }
}
