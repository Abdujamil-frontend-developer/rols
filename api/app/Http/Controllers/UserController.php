<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use Illuminate\Http\Request;
use App\Models\User;
use App\Traits\CheckPermissionTrait;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Support\Facades\Storage;


class UserController extends Controller implements HasMiddleware
{
    use CheckPermissionTrait;
    /**
     * Display a listing of the resource.
     */


    public static function middleware(): array
    {
        return self::getAccessMiddleware('user');
    }

    public function index()
    {
        return response()->json(User::all());
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $validated = $request->validated();
        // Password stored as plain text (no bcrypt)
        $user = User::create($validated);
        return response()->json(['message' => "User successfuly created!", 'data' => $user], 201);
    }

    public function show(string $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => "User not found!"], 404);
        }

        return response()->json($user);
    }

    public function update(UpdateUserRequest $request, string $id)
    {
        $validated = $request->validated();
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        if ($request->hasFile('avatar')) {
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }
            $validated['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }

        if (!empty($validated['password'])) {
            // Password stored as plain text (no bcrypt)
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return response()->json([
            'message' => 'User successfully updated!',
            'data' => $user
        ], 200);
    }

    public function destroy(string $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        $user->delete();
        return response()->json(['message' => "User successfuly deleted!"], 200);
    }
}
