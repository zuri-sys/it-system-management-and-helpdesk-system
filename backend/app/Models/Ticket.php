<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    public const CATEGORIES = ['Hardware', 'Software', 'Network', 'Account', 'Other'];

    public const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

    public const STATUSES = ['Open', 'In Progress', 'Resolved', 'Closed'];

    protected $fillable = ['requester_name', 'requester_email', 'category', 'priority', 'subject', 'description', 'status'];

    protected $appends = ['ticket_number'];

    public function getTicketNumberAttribute(): string
    {
        return 'TKT-'.str_pad((string) $this->id, 6, '0', STR_PAD_LEFT);
    }
}
