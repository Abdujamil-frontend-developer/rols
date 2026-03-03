<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PermissionProfileController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::apiResource('products', ProductController::class);
    Route::apiResource('users', UserController::class); 
    Route::apiResource('roles', RoleController::class);
    Route::get('/permission-profiles', [PermissionProfileController::class, 'index']);
    Route::post('/permission-profiles', [PermissionProfileController::class, 'store']);
    Route::delete('/permission-profiles/{id}', [PermissionProfileController::class, 'destroy']);
});
