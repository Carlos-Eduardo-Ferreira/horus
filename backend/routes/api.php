<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\AuthController;
use App\Http\Resources\UserResource;

// Rotas públicas
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Rotas protegidas
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', function (Request $request) {
        return new UserResource($request->user());
    });
    Route::post('/logout', [AuthController::class, 'logout']);

    // States
    Route::controller(\App\Http\Controllers\StateController::class)->group(function () {
        Route::get('states', 'index');
    });

    // Users
    Route::controller(\App\Http\Controllers\UserController::class)->group(function () {
        Route::get('users', 'index');
        Route::get('users/{user}', 'show');
        Route::post('users', 'storeOrUpdate');
        Route::put('users/{user}', 'storeOrUpdate');
        Route::delete('users/{user}', 'destroy');
    });

    // Local Units
    Route::controller(\App\Http\Controllers\LocalUnitController::class)->group(function () {
        Route::get('local-units', 'index');
        Route::get('local-units/{localUnit}', 'show');
        Route::post('local-units', 'storeOrUpdate');
        Route::put('local-units/{localUnit}', 'storeOrUpdate');
        Route::delete('local-units/{localUnit}', 'destroy');
    });

    // Actions
    Route::controller(\App\Http\Controllers\ActionController::class)->group(function () {
        Route::get('actions', 'index');
        Route::get('actions/{action}', 'show');
        Route::post('actions', 'storeOrUpdate');
        Route::put('actions/{action}', 'storeOrUpdate');
        Route::delete('actions/{action}', 'destroy');
    });

    // Modules
    Route::controller(\App\Http\Controllers\ModuleController::class)->group(function () {
        Route::get('modules', 'index');
        Route::get('modules/{module}', 'show');
        Route::post('modules', 'storeOrUpdate');
        Route::put('modules/{module}', 'storeOrUpdate');
        Route::delete('modules/{module}', 'destroy');
    });
});
