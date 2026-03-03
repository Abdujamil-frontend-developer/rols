<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRoleRequest;
use App\Http\Requests\UpdateRoleRequest;
use App\Traits\CheckPermissionTrait;

class RoleController extends Controller
{
    use CheckPermissionTrait;


    public static function middlewere(): array
    {
        return self::getAccessMiddleware('role');
    }

    /**
     * Display a listing of the resource.
     */

    public function index()
    {
        return response()->json(Role::all(), 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRoleRequest $request)
    {
        $validated = $request->validated();
        $created = Role::create($validated);
        return response()->json(['message' => "Successfuly created", 'data' => $created], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Role $role)
    {
        return response()->json(['data' => $role], 200);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRoleRequest $request, Role $role,)
    {
        $validated = $request->validated();
        $role->update($validated);  
        
        return response()->json(['message' => "Successfuly updated", 'data' => $role], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role)
    {
        $role->delete();
        return response()->json([
            'message' => 'Successfully deleted'
        ], 200);
    }
}
