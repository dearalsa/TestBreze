<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventoryController extends Controller
{
    public function index()
    {
        $inventories = Inventory::with('category')->orderBy('id', 'desc')->get();

        return Inertia::render('Inventories/IndexInventories', [
            'inventories' => $inventories
        ]);
    }

    public function create()
    {
        $categories = Category::orderBy('category_name')->get();

        return Inertia::render('Inventories/CreateInventories', [
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'kode_barang' => 'required|string|max:50|unique:inventories,kode_barang',
            'nama_barang' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'jumlah_barang' => 'required|integer|min:0',
            'deskripsi' => 'nullable|string',
            'status' => 'required|string|max:50',
            'lokasi_barang' => 'required|string|max:255',
            'is_active' => 'required|boolean',
        ]);

        Inventory::create($validated);

        return redirect()->route('inventories.index')->with('success', 'Barang berhasil ditambahkan.');
    }

    public function show(string $id)
    {
        $inventory = Inventory::with('category')->findOrFail($id);

        return Inertia::render('Inventories/ShowInventories', [
            'inventory' => $inventory
        ]);
    }

    public function edit(string $id)
    {
        $inventory = Inventory::findOrFail($id);
        $categories = Category::orderBy('category_name')->get();

        return Inertia::render('Inventories/EditInventories', [
            'inventory' => $inventory,
            'categories' => $categories
        ]);
    }

    public function update(Request $request, string $id)
    {
        $inventory = Inventory::findOrFail($id);

        $validated = $request->validate([
            'kode_barang' => 'required|string|max:50|unique:inventories,kode_barang,' . $inventory->id,
            'nama_barang' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'jumlah_barang' => 'required|integer|min:0',
            'deskripsi' => 'nullable|string',
            'status' => 'required|string|max:50',
            'lokasi_barang' => 'required|string|max:255',
            'is_active' => 'required|boolean',
        ]);

        $inventory->update($validated);

        return redirect()->route('inventories.index')->with('success', 'Barang berhasil diperbarui.');
    }

    public function destroy(string $id)
    {
        $inventory = Inventory::findOrFail($id);
        $inventory->delete();

        return redirect()->route('inventories.index')->with('success', 'Barang berhasil dihapus.');
    }
}
