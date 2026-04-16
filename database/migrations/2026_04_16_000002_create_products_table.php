<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('author');
            $table->string('genre');
            $table->string('category');
            $table->text('description');
            $table->decimal('price', 10, 2);
            $table->decimal('original_price', 10, 2)->nullable();
            $table->decimal('rating', 3, 1)->default(4.8);
            $table->unsignedInteger('review_count')->default(0);
            $table->unsignedInteger('stock')->default(0);
            $table->boolean('is_active')->default(true);
            $table->string('badge')->nullable();
            $table->string('cover_emoji', 10);
            $table->string('cover_class');
            $table->string('cover_gradient');
            $table->json('formats');
            $table->unsignedInteger('pages');
            $table->string('language');
            $table->string('published_label');
            $table->boolean('is_featured')->default(false);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
