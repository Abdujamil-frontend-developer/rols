<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PermissionProfile extends Model
{
    protected $fillable = ['name', 'access'];

    protected function casts(): array
    {
        return [
            'access' => 'array',
        ];
    }
}
