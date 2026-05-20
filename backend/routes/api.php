<?php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TaskHistoryController;
use Illuminate\Support\Facades\Route;


Route::get('/', function () {
    return response()->json([
        'status' => 'API working'
    ]);
});
/*
|-------------------------
| Public Auth
|-------------------------
*/
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

/*
|-------------------------
| Protected (JWT)
|-------------------------
*/

Route::middleware('auth:api')->group(function () {

    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });

    Route::prefix('tasks')->group(function () {
        Route::get('/', [TaskController::class, 'index']);
        Route::post('/', [TaskController::class, 'store']);
        Route::get('/{id}', [TaskController::class, 'show']);
        Route::patch('/{id}', [TaskController::class, 'update']);
        Route::delete('/{id}', [TaskController::class, 'destroy']);
    });

    // Route::get('/categories', [CategoryController::class, 'index']);
});

Route::middleware('auth:api')->group(function () {
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::patch('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
});

Route::get('/tasks/{id}/history', [TaskHistoryController::class, 'index']);


Route::middleware('auth:api')->group(function () {

    Route::get('/tasks/trashed', [TaskController::class, 'trashed']);
    Route::get('/tasks/all', [TaskController::class, 'allTasks']);
    Route::patch('/tasks/{id}/force', [TaskController::class, 'forceUpdate']);
    Route::delete('/tasks/{id}/force', [TaskController::class, 'forceDelete']);
});
