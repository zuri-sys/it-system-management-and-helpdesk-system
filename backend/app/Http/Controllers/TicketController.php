<?php

namespace App\Http\Controllers;

use App\Http\Requests\SaveTicketRequest;
use App\Models\Ticket;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class TicketController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Ticket::latest('id')->get());
    }

    public function store(SaveTicketRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['status'] = 'Open';

        return response()->json(Ticket::create($data), 201);
    }

    public function show(Ticket $ticket): JsonResponse
    {
        return response()->json($ticket);
    }

    public function update(SaveTicketRequest $request, Ticket $ticket): JsonResponse
    {
        $ticket->update($request->validated());

        return response()->json($ticket->fresh());
    }

    public function destroy(Ticket $ticket): Response
    {
        $ticket->delete();

        return response()->noContent();
    }
}
