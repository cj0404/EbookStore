<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Support\CartManager;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{

    public function checkout(Request $request): Response|RedirectResponse
    {
        $user = $request->attributes->get('auth_user');

        if ($user?->is_admin) {
            return redirect()->route('admin.dashboard')->with('error', 'Admins cannot checkout.');
        }

        $totals = CartManager::totals();

        if ($totals['item_count'] === 0) {
            return redirect()->route('products');
        }


        return Inertia::render('Store/Checkout', [
            ...$totals,
            'user' => $user,
        ]);
    }


    public function placeOrder(Request $request): RedirectResponse
    {
        $user = $request->attributes->get('auth_user');

        if ($user?->is_admin) {
            return redirect()->back()->with('error', 'Admins cannot place orders.');
        }

        $totals = CartManager::totals();

        if ($totals['item_count'] === 0) {
            return redirect()->route('cart');
        }


        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email'],
            'phone' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string'],
            'city' => ['required', 'string', 'max:255'],
            'province' => ['required', 'string', 'max:255'],
            'zip' => ['required', 'string', 'max:20'],
            'country' => ['required', 'string', 'max:255'],
            'delivery_notes' => ['nullable', 'string'],
            'payment_method' => ['required', 'in:cod,bank,gcash'],
        ]);

        $user = $request->attributes->get('auth_user');
        $orderCount = Order::count() + 847;

        $order = Order::create([
            'user_id' => $user->id,
            'order_number' => 'DP-' . now()->format('Y') . '-' . str_pad((string) $orderCount, 5, '0', STR_PAD_LEFT),
            'status' => 'Pending',
            'payment_method' => match ($validated['payment_method']) {
                'bank' => 'Bank Transfer',
                'gcash' => 'GCash / Maya',
                default => 'Cash on Delivery',
            },
            'payment_status' => 'Pending',
            'shipping_name' => $validated['first_name'] . ' ' . $validated['last_name'],
            'shipping_email' => $validated['email'],
            'shipping_phone' => $validated['phone'],
            'shipping_address' => $validated['address'],
            'shipping_city' => $validated['city'],
            'shipping_province' => $validated['province'],
            'shipping_zip' => $validated['zip'],
            'shipping_country' => $validated['country'],
            'delivery_notes' => $validated['delivery_notes'] ?? null,
            'subtotal' => $totals['subtotal'],
            'shipping_fee' => 0,
            'total' => $totals['total'],
        ]);

        foreach ($totals['items'] as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item['product']->id,
                'product_title' => $item['product']->title,
                'product_author' => $item['product']->author,
                'cover_emoji' => $item['product']->cover_emoji,
                'cover_class' => $item['product']->cover_class,
                'formats' => $item['product']->formats,
                'quantity' => $item['quantity'],
                'unit_price' => $item['product']->price,
                'line_total' => $item['line_total'],
            ]);
        }

        CartManager::clear();

        return redirect()->route('order.confirmation', $order);
    }

    public function confirmation(Order $order): Response
    {
        $order->load('items', 'user');

        return Inertia::render('Store/OrderConfirmation', [
            'order' => $order,
        ]);
    }
}
