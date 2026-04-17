<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->string('search'));
        $genre = trim((string) $request->string('genre'));
        $status = trim((string) $request->string('status'));

        $query = Product::query()->orderBy('sort_order');

        if ($search !== '') {
            $query->where(function ($builder) use ($search) {
                $builder
                    ->where('title', 'like', "%{$search}%")
                    ->orWhere('author', 'like', "%{$search}%");
            });
        }

        if ($genre !== '' && $genre !== 'All Genres') {
            $query->where('genre', $genre);
        }

        if ($status === 'Active') {
            $query->where('is_active', true);
        }

        if ($status === 'Inactive') {
            $query->where('is_active', false);
        }

        return Inertia::render('Admin/Products', [
            'products' => $query->paginate(8)->withQueryString(),
            'filters' => compact('search', 'genre', 'status'),
            'genres' => Product::query()->select('genre')->distinct()->pluck('genre'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validatedData($request);

        // handle uploaded image file (from Inertia form multipart)
        if ($request->hasFile('image_file') && $request->file('image_file')->isValid()) {
            $file = $request->file('image_file');
            $filename = uniqid('book_') . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('images'), $filename);
            $data['image'] = $filename;
        }

        Product::create($data);

        return redirect()->route('admin.products')->with('success', 'Book added successfully.');
    }

    public function update(Request $request, Product $product): RedirectResponse
    {
        $data = $this->validatedData($request, $product);

        if ($request->hasFile('image_file') && $request->file('image_file')->isValid()) {
            $file = $request->file('image_file');
            $filename = uniqid('book_') . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('images'), $filename);
            $data['image'] = $filename;
        }

        $product->update($data);

        return redirect()->route('admin.products')->with('success', 'Book updated successfully.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        $product->delete();

        return redirect()->route('admin.products')->with('success', 'Book deleted successfully.');
    }

    public function availability(Product $product): RedirectResponse
    {
        $product->update([
            'is_active' => ! $product->is_active,
        ]);

        return redirect()->route('admin.products')->with('success', 'Availability updated.');
    }

    /**
     * Return list of image filenames in public/images for admin to browse.
     */
    public function images(Request $request)
    {
        $dir = public_path('images');
        $files = [];

        if (is_dir($dir)) {
            foreach (scandir($dir) as $file) {
                if (in_array($file, ['.', '..'])) {
                    continue;
                }
                $path = $dir . DIRECTORY_SEPARATOR . $file;
                if (is_file($path)) {
                    $files[] = $file;
                }
            }
        }

        return response()->json(['images' => $files]);
    }

    protected function validatedData(Request $request, ?Product $product = null): array
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'author' => ['required', 'string', 'max:255'],
            'genre' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'price' => ['required', 'numeric', 'min:1'],
            'original_price' => ['nullable', 'numeric', 'min:1'],
            'stock' => ['required', 'integer', 'min:0'],
            'badge' => ['nullable', 'string', 'max:255'],
            'cover_emoji' => ['required', 'string', 'max:10'],
            'cover_class' => ['required', 'string', 'max:255'],
            'cover_gradient' => ['required', 'string', 'max:255'],
            'pages' => ['required', 'integer', 'min:1'],
            'language' => ['required', 'string', 'max:255'],
'published_label' => ['required', 'string', 'max:255'],
            'image' => ['nullable', 'string', 'max:255'],
            'image_file' => ['nullable', 'file', 'image', 'max:4096'],
            'formats' => ['required', 'array', 'min:1'],
            'formats.*' => ['string'],
            'is_active' => ['required', 'boolean'],
        ]);

        $validated['slug'] = Str::slug($validated['title']);
        $validated['rating'] = $product?->rating ?? 4.7;
        $validated['review_count'] = $product?->review_count ?? 120;
        $validated['is_featured'] = $product?->is_featured ?? false;
        $validated['sort_order'] = $product?->sort_order ?? (Product::max('sort_order') + 1);

        return $validated;
    }
}

