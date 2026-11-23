<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Services\ProductService;

class ProductController extends Controller
{
    public function __construct(private ProductService $products) {}

    /** Public Products catalog — every product is visible (no draft/published split, matches products-data.ts). */
    public function index()
    {
        return ProductResource::collection($this->products->all());
    }

    public function show(string $code)
    {
        $product = $this->products->find($code);
        abort_if(! $product, 404);

        return new ProductResource($product);
    }

    public function store(StoreProductRequest $request)
    {
        $this->authorize('manage-content');
        $product = $this->products->create($request->validated());

        return new ProductResource($product);
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        $this->authorize('manage-content');
        $product = $this->products->update($product, $request->validated());

        return new ProductResource($product);
    }

    public function destroy(Product $product)
    {
        $this->authorize('manage-content');
        $this->products->delete($product);

        return response()->json(['message' => 'Product deleted.']);
    }
}
