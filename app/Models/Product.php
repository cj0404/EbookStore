<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;


    protected $fillable = [
        'title',
        'slug',
        'author',
        'genre',
        'category',
        'description',
        'price',
        'original_price',
        'rating',
        'review_count',
        'stock',
        'is_active',
        'badge',
        'image',
        'cover_emoji',
        'cover_class',
        'cover_gradient',
        'formats',
        'pages',
        'language',
        'published_label',
        'is_featured',
        'sort_order',
    ];

    public function wishlists()
    {
        return $this->hasMany(Wishlist::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'wishlists');
    }

    /**
     * Use the slug for route model binding.
     */
    public function getRouteKeyName()
    {
        return 'slug';
    }


    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'original_price' => 'decimal:2',
            'rating' => 'decimal:1',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'formats' => 'array',
            'image' => 'string',
        ];
    }
}
