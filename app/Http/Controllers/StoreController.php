<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Support\CartManager;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Order;


class StoreController extends Controller
{
    public function home(): Response
    {
        $featured = Product::query()
            ->where('is_active', true)
            ->where('is_featured', true)
            ->orderBy('sort_order')
            ->limit(4)
            ->get();

        $categories = Product::query()
            ->selectRaw('category, COUNT(*) as total')
            ->where('is_active', true)
            ->groupBy('category')
            ->orderBy('category')
            ->get();

        return Inertia::render('Store/Home', [
            'featuredProducts' => $featured,
            'categories' => $categories,
            'cartCount' => CartManager::totals()['item_count'],
        ]);
    }

    public function products(Request $request): Response
    {
        $search = trim((string) $request->string('search'));
        $category = trim((string) $request->string('category'));
        $sort = (string) $request->input('sort', 'featured');

        $query = Product::query()->where('is_active', true);

        if ($search !== '') {
            $query->where(function ($builder) use ($search) {
                $builder
                    ->where('title', 'like', "%{$search}%")
                    ->orWhere('author', 'like', "%{$search}%")
                    ->orWhere('genre', 'like', "%{$search}%");
            });
        }

        if ($category !== '' && $category !== 'All Books') {
            $query->where('category', $category);
        }

        match ($sort) {
            'price_low' => $query->orderBy('price'),
            'price_high' => $query->orderByDesc('price'),
            'top_rated' => $query->orderByDesc('rating')->orderByDesc('review_count'),
            'newest' => $query->latest(),
            default => $query->orderBy('sort_order'),
        };

        $products = $query->paginate(9)->withQueryString();

        $categories = Product::query()
            ->selectRaw('category, COUNT(*) as total')
            ->where('is_active', true)
            ->groupBy('category')
            ->orderBy('category')
            ->get();

        return Inertia::render('Store/Products', [
            'products' => $products,
            'filters' => compact('search', 'category', 'sort'),
            'categories' => $categories,
        ]);
    }


    public function product(Product $product): Response
    {
        abort_unless($product->is_active, 404);

        $related = Product::query()
            ->where('is_active', true)
            ->where('id', '!=', $product->id)
            ->where('category', $product->category)
            ->orderBy('sort_order')
            ->limit(4)
            ->get();

        return Inertia::render('Store/ProductDetails', [
            'product' => $product,
            'relatedProducts' => $related,
        ]);
    }

    public function orders(Request $request): Response
    {
        $user = $request->attributes->get('auth_user');

        $orders = $user->orders()
            ->with(['items.product'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Store/MyOrders', [
            'orders' => $orders,
        ]);
    }
}

