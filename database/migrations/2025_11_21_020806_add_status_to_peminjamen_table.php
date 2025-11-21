<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('peminjamen', function (Blueprint $table) {
            $table->enum('status', ['dipinjam', 'dikembalikan', 'expired'])->default('dipinjam'); 
            $table->datetime('tanggal_pengembalian')->nullable(); 
        });
    }

    public function down(): void
    {
        Schema::table('peminjamen', function (Blueprint $table) {
            $table->dropColumn(['status', 'tanggal_pengembalian']);
        });
    }
};