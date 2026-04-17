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
    public function index(Request $request): Response|RedirectResponse
    {
        $user = $request->attributes->get('auth_user');

        if ($user?->is_admin) {
            return redirect()->route('admin.dashboard')->with('error', 'Admins cannot use cart.');
        }

        return Inertia::render('Store/Cart', CartManager::totals());
    }



    public function store(Request $request, $productId): RedirectResponse
    {
        $user = $request->attributes->get('auth_user');

        if ($user?->is_admin) {
            return redirect()->back()->with('error', 'Admins cannot add to cart.');
        }

        $product = Product::findOrFail($productId);

        $validated = $request->validate([
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $existing = session('cart.' . $product->id, 0);

        CartManager::setQuantity($request, $product, $existing + $validated['quantity']);

        return redirect()->route('cart')->with('success', "{$product->title} added to cart.");
    }


    public function update(Request $request, Product $product): RedirectResponse
    {
        $user = $request->attributes->get('auth_user');

        if ($user?->is_admin) {
            return redirect()->back()->with('error', 'Admins cannot update cart.');
        }

        $validated = $request->validate([
            'quantity' => ['required', 'integer', 'min:0'],
        ]);


        CartManager::setQuantity($request, $product, $validated['quantity']);


        return redirect()->route('cart');
    }



    public function destroy(Request $request, Product $product): RedirectResponse
    {
        $user = $request->attributes->get('auth_user');

        if ($user?->is_admin) {
            return redirect()->back()->with('error', 'Admins cannot remove from cart.');
        }


        CartManager::setQuantity($request, $product, 0);


        return redirect()->route('cart');
    }

}
