<?php

namespace App\Http\Controllers;

use App\Models\PermissionProfile;
use Illuminate\Http\Request;

class PermissionProfileController extends Controller
{
    public function index()
    {
        return response()->json(PermissionProfile::latest()->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'access' => 'array',
        ]);

        $profile = PermissionProfile::create([
            'name' => $request->name,
            'access' => $request->access ?? [],
        ]);

        return response()->json($profile, 201);
    }

    public function destroy(string $id)
    {
        $profile = PermissionProfile::findOrFail($id);
        $profile->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
