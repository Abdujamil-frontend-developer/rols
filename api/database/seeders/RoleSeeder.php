<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{

    public function run(): void
    {
        Role::create([
            'role' => "user",
            'access' => ["product:read"],
            'isAdmin' => false
        ]);
        Role::create([
            'role' => "admin",
            'access' => ['product:create', 'product:read', 'product:update', 'product:delete', 'user:create', 'user:read', 'user:update', 'user:delete'],
            'isAdmin' => true
        ]);
    }
}
