<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('username')->nullable()->unique()->after('email');
            $table->string('phone')->nullable()->after('username');
            $table->string('favorite_genre')->nullable()->after('phone');
            $table->boolean('is_admin')->default(false)->after('favorite_genre');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['username', 'phone', 'favorite_genre', 'is_admin']);
        });
    }
};
