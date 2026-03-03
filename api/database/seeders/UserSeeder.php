<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin User',
            'login' => 'admin',
            'password' => '1234',
            'role_id' => 2,
            'access' => ['product:create', 'product:read', 'product:update', 'product:delete', 'user:create', 'user:read', 'user:update', 'user:delete'],
            'is_active' => true,
        ]);

        User::create([
            'name' => 'Ali user',
            'login' => 'user',
            'password' => '1234',
            'role_id' => 1,
            'access' => ['product:read'],
            'is_active' => true,
        ]);
    }
}
