<?php

namespace App\Traits;

use Illuminate\Routing\Controllers\Middleware;

trait CheckPermissionTrait
{
    public static function getAccessMiddleware($entity): array
    {
        return [
            new Middleware("check_access:{$entity}:read", only: ['index', 'show']),
            new Middleware("check_access:{$entity}:create", only: ['store']),
            new Middleware("check_access:{$entity}:update", only: ['update']),
            new Middleware("check_access:{$entity}:delete", only: ['destroy']),
        ];
    }
}
