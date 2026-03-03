<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'login' => 'required',
            'password' => 'required',
        ]);

        $user = User::where('login', $request->login)->first();

        if (!$user || $request->password !== $user->password) {
            return response()->json([
                'message' => 'password or login error!'
            ], 401);
        };


        $token = $user->createToken('token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'access_token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Tizimdan muvaffaqiyatli chiqdingiz!'
        ]);
    }

    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user(),
            'access' => $request->user()->access // Assuming 'access' is an attribute or relationship available on the User model
        ]);
    }
}
