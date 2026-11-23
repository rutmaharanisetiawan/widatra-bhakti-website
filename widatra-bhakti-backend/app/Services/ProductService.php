<?php

namespace App\Services;

use App\Models\Product;
use App\Repositories\Contracts\ProductRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;

class ProductService
{
    public function __construct(private ProductRepositoryInterface $products) {}

    public function all(): Collection
    {
        return $this->products->all();
    }

    public function find(string $code): ?Product
    {
        return $this->products->findByCode($code);
    }

    public function create(array $data): Product
    {
        if (empty($data['code'])) {
            $base = Str::upper(Str::slug($data['name'], '-'));
            $code = $base;
            $i = 2;
            while ($this->products->codeExists($code)) {
                $code = "{$base}-{$i}";
                $i++;
            }
            $data['code'] = $code;
        }

        return $this->products->create($data);
    }

    public function update(Product $product, array $data): Product
    {
        return $this->products->update($product, $data);
    }

    public function delete(Product $product): void
    {
        $this->products->delete($product);
    }
}
