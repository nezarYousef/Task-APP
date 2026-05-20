<?php

use Illuminate\Support\Facades\Route;




Route::get('/', function () {
    return response()->json([
        'status' => 'Laravel API running successfully'
    ]);
});
Route::get('/', function () {
    return view('welcome');
});
