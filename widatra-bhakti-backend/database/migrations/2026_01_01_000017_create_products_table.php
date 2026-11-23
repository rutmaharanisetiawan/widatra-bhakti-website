<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->string('code')->primary();
            $table->string('name');
            $table->enum('category', ['Basic Intravenous', 'Specialty Solution', 'Irrigation', 'Medical Device']);
            $table->enum('brand', ['Generic', 'Branded']);
            $table->string('osmolarity')->nullable();
            $table->string('calorie')->nullable();
            $table->string('nie')->nullable();
            $table->json('packaging');
            $table->json('sizes');
            $table->text('indication');
            $table->json('benefits');
            $table->json('applications');
            $table->text('storage');
            $table->string('shelf_life');
            $table->text('composition');
            $table->text('manufacturing_note')->nullable();
            $table->string('img')->nullable();
            $table->string('tagline')->nullable();
            $table->timestamps();

            $table->index('category');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
