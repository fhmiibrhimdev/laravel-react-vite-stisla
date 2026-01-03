<?php

use App\Http\Controllers\GalleryController;
use App\Http\Controllers\PersonalController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/


Route::post('/register', App\Http\Controllers\Api\RegisterController::class)->name('register');
Route::post('/login', App\Http\Controllers\Api\LoginController::class)->name('login');
Route::middleware('auth:api')->get('/user', function (Request $request) {
    $user = $request->user(); $role = $user->hasRole('admin') ? 'admin' : 'user';
    $user->setAttribute('role', $role);
    return $user;
});

Route::group(['middleware' => ['auth:api']], function () {
    Route::get('/user', function (Request $request) {
        $user = $request->user(); $role = $user->hasRole('admin') ? 'admin' : 'user';
        $user->setAttribute('role', $role);
        return $user;
    });
    Route::get('/profile', [PersonalController::class, 'index']);
    Route::put('/profile', [PersonalController::class, 'updateProfile']);
    Route::put('/update-password', [PersonalController::class, 'updatePassword']);
});

Route::group(['middleware' => ['auth:api', 'role:admin']], function () {
    Route::resource('/products', ProductController::class);
    Route::post('/products/multiple-store', [ProductController::class, 'multipleStore']);
    Route::resource('/gallery', GalleryController::class);
});

Route::post('/logout', App\Http\Controllers\Api\LogoutController::class)->name('logout');