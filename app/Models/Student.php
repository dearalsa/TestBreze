<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions; 

class Student extends Model
{
    use HasFactory;
    use LogsActivity; 
    protected $fillable = [
        'nisn',
        'nama_lengkap',
        'jenis_kelamin',
        'foto_wajah',
        'tempat_lahir',
        'tanggal_lahir',
        'alamat',
        'jurusan',
        'angkatan',
        'no_hp',
        'is_active',
        'added_by', 
    ];
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll() 
            ->logOnlyDirty() 
            ->dontSubmitEmptyLogs()
            ->setDescriptionForEvent(fn(string $eventName) => "Data Siswa: {$this->nama_lengkap} telah di-{$eventName}.");
    }
    public function addedBy()
    {
        return $this->belongsTo(User::class, 'added_by');
    }
}