<?php

namespace App\Providers;

use App\Models\User;
use App\Support\CartManager;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Inertia::share([
            'auth' => fn () => [
                'user' => Session::has('auth_user_id')
                    ? User::find(Session::get('auth_user_id'))
                    : null,
            ],
            'cartCount' => fn () => CartManager::totals()['item_count'],
            'flash' => fn () => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }
}
