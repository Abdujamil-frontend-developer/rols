<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Models\Product;
use App\Traits\CheckPermissionTrait;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class ProductController extends Controller implements HasMiddleware
{
    /**
     * Display a listing of the resource.
     */

    use CheckPermissionTrait;
    public static function middleware(): array
    {
        return self::getAccessMiddleware('product');
    }
    public function index()
    {
        return response()->json(Product::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request)
    {
        $validated = $request->validated();

        return response()->json(Product::create($validated));
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return response()->json(Product::find($id));
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(StoreProductRequest $request, string $id)
    {
        $validated = $request->validated();
        $product = Product::find($id);



        $product->update($validated);

        return response()->json(['message' => "Product successfuly updated!", 'data' => $product], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['message' => "Product not found"], 404);
        }
        $product->delete();

        return response()->json(['message' => "Product successfuly deleted", 'data' => $product], 200);
    }
}
