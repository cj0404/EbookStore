<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $orders = Order::with('items')->latest()->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'sales' => $orders->sum('total'),
                'orders' => $orders->count(),
                'customers' => User::where('is_admin', false)->count(),
                'products' => Product::count(),
            ],
            'monthlySales' => collect(range(1, 12))->map(function (int $month) use ($orders) {
                return [
                    'label' => now()->startOfYear()->month($month)->format('M'),
                    'value' => (float) $orders
                        ->filter(fn (Order $order) => (int) $order->created_at->format('n') === $month)
                        ->sum('total'),
                ];
            }),
            'lowStockProducts' => Product::where('stock', '<=', 5)->orderBy('stock')->get(),
            'recentOrders' => Order::latest()->take(5)->get(),
        ]);
    }
}
