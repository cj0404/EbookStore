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

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'original_price' => 'decimal:2',
            'rating' => 'decimal:1',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'formats' => 'array',
        ];
    }
}
