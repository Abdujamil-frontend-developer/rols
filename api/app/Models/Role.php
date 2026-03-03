<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    /** @use HasFactory<\Database\Factories\RoleFactory> */
    use HasFactory;
    protected $table = 'roles';
    protected $primaryKey = 'role_id';
    protected $fillable = [
        "role",
        "access",
        "isAdmin"
    ];

    protected $casts = [
        'access' => "array",
    ];
}
