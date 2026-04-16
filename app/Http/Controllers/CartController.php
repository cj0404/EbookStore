<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Support\CartManager;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Store/Cart', CartManager::totals());
    }

    public function store(Request $request, Product $product): RedirectResponse
    {
        $validated = $request->validate([
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $existing = session('cart.' . $product->id, 0);
        CartManager::setQuantity($product, $existing + $validated['quantity']);

        return redirect()->route('cart')->with('success', "{$product->title} added to cart.");
    }

    public function update(Request $request, Product $product): RedirectResponse
    {
        $validated = $request->validate([
            'quantity' => ['required', 'integer', 'min:0'],
        ]);

        CartManager::setQuantity($product, $validated['quantity']);

        return redirect()->route('cart');
    }

    public function destroy(Product $product): RedirectResponse
    {
        CartManager::setQuantity($product, 0);

        return redirect()->route('cart');
    }
}
