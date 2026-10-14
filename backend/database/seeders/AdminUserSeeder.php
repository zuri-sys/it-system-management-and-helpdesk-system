<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use RuntimeException;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $username = config('helpdesk.admin_username');
        if (User::where('username', $username)->exists()) {
            return;
        }

        $password = config('helpdesk.admin_password');
        if (! is_string($password) || strlen($password) < 8) {
            throw new RuntimeException('Set ADMIN_PASSWORD to at least eight characters before creating the admin account.');
        }

        User::create([
            'name' => 'System Administrator',
            'username' => $username,
            'email' => config('helpdesk.admin_email'),
            'password' => $password,
        ]);
    }
}
