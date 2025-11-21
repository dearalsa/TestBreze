<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Peminjaman extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'peminjam_id',
        'role',
        'barang_id',
        'tanggal_peminjam',
        'tanggal_kembali',
        'keterangan',
        'status',
        'tanggal_pengembalian',
        'added_by',
    ];
}