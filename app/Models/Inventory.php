<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Inventory extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'kode_barang',
        'nama_barang',
        'category_id',
        'jumlah_barang',
        'deskripsi',
        'status',
        'lokasi_barang',
        'is_active',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->setDescriptionForEvent(fn(string $eventName) =>
                "Data Inventaris: {$this->nama_barang} telah di-{$eventName}.");
    }
}
