<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\SessionController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\StoreController;
use Illuminate\Support\Facades\Route;

Route::get('/', [StoreController::class, 'home'])->name('home');
Route::get('/products', [StoreController::class, 'products'])->name('products');
Route::get('/products/{product:slug}', [StoreController::class, 'product'])->name('products.show');

Route::get('/login', [SessionController::class, 'create'])->middleware('guest.only')->name('login');
Route::post('/login', [SessionController::class, 'store'])->middleware('guest.only')->name('login.store');
Route::post('/logout', [SessionController::class, 'destroy'])->middleware('auth.session')->name('logout');

Route::get('/register', [RegisterController::class, 'create'])->middleware('guest.only')->name('register');
Route::post('/register', [RegisterController::class, 'store'])->middleware('guest.only')->name('register.store');

Route::get('/cart', [CartController::class, 'index'])->name('cart');
Route::post('/cart/{product}', [CartController::class, 'store'])->name('cart.store');
Route::patch('/cart/{product}', [CartController::class, 'update'])->name('cart.update');
Route::delete('/cart/{product}', [CartController::class, 'destroy'])->name('cart.destroy');

Route::middleware('auth.session')->group(function () {
    Route::get('/checkout', [CheckoutController::class, 'checkout'])->name('checkout');
    Route::post('/checkout', [CheckoutController::class, 'placeOrder'])->name('checkout.store');
    Route::get('/order-confirmation/{order}', [CheckoutController::class, 'confirmation'])->name('order.confirmation');

    Route::prefix('admin')->middleware('admin')->group(function () {
        Route::get('/dashboard', DashboardController::class)->name('admin.dashboard');
        Route::get('/products', [AdminProductController::class, 'index'])->name('admin.products');
        Route::post('/products', [AdminProductController::class, 'store'])->name('admin.products.store');
        Route::patch('/products/{product}', [AdminProductController::class, 'update'])->name('admin.products.update');
        Route::patch('/products/{product}/availability', [AdminProductController::class, 'availability'])->name('admin.products.availability');
        Route::delete('/products/{product}', [AdminProductController::class, 'destroy'])->name('admin.products.destroy');
        Route::get('/orders', [AdminOrderController::class, 'index'])->name('admin.orders');
        Route::patch('/orders/{order}', [AdminOrderController::class, 'update'])->name('admin.orders.update');
    });
});
