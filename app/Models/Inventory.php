<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    use HasFactory;

    protected $fillable = [
        'kode_barang',
        'nama_barang',
        'kategori',
        'jumlah_barang',
        'deskripsi',
        'status',
        'lokasi_barang',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
