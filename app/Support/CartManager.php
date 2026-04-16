<?php

namespace App\Support;

use App\Models\Product;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Session;

class CartManager
{
    public static function content(): Collection
    {
        $cart = collect(Session::get('cart', []));

        if ($cart->isEmpty()) {
            return collect();
        }

        $products = Product::whereIn('id', $cart->keys())->get()->keyBy('id');

        return $cart
            ->map(function (int $quantity, int|string $productId) use ($products) {
                $product = $products->get((int) $productId);

                if (! $product) {
                    return null;
                }

                return [
                    'product' => $product,
                    'quantity' => $quantity,
                    'line_total' => (float) $product->price * $quantity,
                ];
            })
            ->filter()
            ->values();
    }

    public static function totals(): array
    {
        $items = self::content();
        $subtotal = $items->sum('line_total');
        $totalItems = $items->sum('quantity');

        return [
            'items' => $items,
            'item_count' => $totalItems,
            'subtotal' => $subtotal,
            'shipping_fee' => 0,
            'total' => $subtotal,
        ];
    }

    public static function setQuantity(Product $product, int $quantity): void
    {
        $cart = Session::get('cart', []);

        if ($quantity <= 0) {
            unset($cart[$product->id]);
        } else {
            $cart[$product->id] = min($quantity, max(1, $product->stock));
        }

        Session::put('cart', $cart);
    }

    public static function clear(): void
    {
        Session::forget('cart');
    }
}
