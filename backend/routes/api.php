<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\AuthController;
use App\Http\Resources\UserResource;
use App\Http\Controllers\ActionController;

// Rotas públicas
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Rotas protegidas
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', function (Request $request) {
        return new UserResource($request->user());
    });
    Route::post('/logout', [AuthController::class, 'logout']);

    // Rotas para actions
    Route::get('actions', [ActionController::class, 'index']);
    Route::get('actions/{action}', [ActionController::class, 'show']);
    Route::post('actions', [ActionController::class, 'storeOrUpdate']);
    Route::put('actions/{action}', [ActionController::class, 'storeOrUpdate']);
    Route::delete('actions/{action}', [ActionController::class, 'destroy']);
});
