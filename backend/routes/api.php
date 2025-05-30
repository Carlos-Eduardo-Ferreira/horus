<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\AuthController;
use App\Http\Resources\UserResource;
use App\Http\Controllers\ActionController;
use App\Http\Controllers\ModuleController;
use App\Http\Controllers\LocalUnitController;

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

    // Rotas para modules
    Route::get('modules', [ModuleController::class, 'index']);
    Route::get('modules/{module}', [ModuleController::class, 'show']);
    Route::post('modules', [ModuleController::class, 'storeOrUpdate']);
    Route::put('modules/{module}', [ModuleController::class, 'storeOrUpdate']);
    Route::delete('modules/{module}', [ModuleController::class, 'destroy']);

    // Rotas para local units
    Route::get('local-units', [LocalUnitController::class, 'index']);
    Route::get('local-units/{local-unit}', [LocalUnitController::class, 'show']);
    Route::post('local-units', [LocalUnitController::class, 'storeOrUpdate']);
    Route::put('local-units/{local-unit}', [LocalUnitController::class, 'storeOrUpdate']);
    Route::delete('local-units/{local-unit}', [LocalUnitController::class, 'destroy']);
});
