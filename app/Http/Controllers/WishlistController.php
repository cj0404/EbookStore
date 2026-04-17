<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\User;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class WishlistController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->attributes->get('auth_user');

        $wishlists = Wishlist::where('user_id', $user->id)
            ->with('product')
            ->latest()
            ->paginate(12);

        return Inertia::render('Store/Wishlist', [
            'wishlists' => $wishlists,
        ]);
    }

    public function toggle(Request $request, Product $product): RedirectResponse
    {
        $user = $request->attributes->get('auth_user');

        $wishlist = Wishlist::where('user_id', $user->id)
            ->where('product_id', $product->id)
            ->first();

        if ($wishlist) {
            $wishlist->delete();
            return redirect()->back()->with('success', 'Removed from wishlist!');
        }

        Wishlist::create([
            'user_id' => $user->id,
            'product_id' => $product->id,
        ]);

        return redirect()->back()->with('success', 'Added to wishlist!');
    }
}

