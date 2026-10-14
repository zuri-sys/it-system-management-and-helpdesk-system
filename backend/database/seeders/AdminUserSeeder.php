<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $username = config('helpdesk.admin_username');
        if (User::where('username', $username)->exists()) {
            return;
        }

        $password = config('helpdesk.admin_password');
        User::create([
            'name' => 'System Administrator',
            'username' => $username,
            'email' => config('helpdesk.admin_email'),
            'password' => $password,
        ]);
    }
}
