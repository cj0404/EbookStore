<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->string('search'));
        $payment = trim((string) $request->string('payment'));
        $status = trim((string) $request->string('status'));

        $query = Order::query()->with('items')->latest();

        if ($search !== '') {
            $query->where(function ($builder) use ($search) {
                $builder
                    ->where('order_number', 'like', "%{$search}%")
                    ->orWhere('shipping_name', 'like', "%{$search}%");
            });
        }

        if ($payment !== '' && $payment !== 'All Payment Methods') {
            $query->where('payment_method', $payment);
        }

        if ($status !== '' && $status !== 'All Orders') {
            $query->where('status', $status);
        }

        return Inertia::render('Admin/Orders', [
            'orders' => $query->paginate(8)->withQueryString(),
            'filters' => compact('search', 'payment', 'status'),
            'statusCounts' => [
                'All Orders' => Order::count(),
                'Pending' => Order::where('status', 'Pending')->count(),
                'Paid' => Order::where('status', 'Paid')->count(),
                'Shipped' => Order::where('status', 'Shipped')->count(),
                'Completed' => Order::where('status', 'Completed')->count(),
            ],
        ]);
    }

    public function update(Request $request, Order $order): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:Pending,Paid,Shipped,Completed'],
        ]);

        $order->update([
            'status' => $validated['status'],
            'payment_status' => in_array($validated['status'], ['Paid', 'Shipped', 'Completed'], true) ? 'Paid' : 'Pending',
        ]);

        return redirect()->route('admin.orders')->with('success', 'Order status updated.');
    }
}
