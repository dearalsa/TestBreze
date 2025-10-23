<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('inventories', function (Blueprint $table) {
            $table->id();
            $table->string('kode_barang')->unique(); 
            $table->string('nama_barang');
            $table->string('kategori');
            $table->integer('jumlah_barang')->default(0); 
            $table->string('deskripsi')->nullable();
            $table->string('status');
            $table->string('lokasi_barang');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventories');
    }
};