<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity; 
use Spatie\Activitylog\LogOptions; 

class Teacher extends Model
{
    use HasFactory;
    use LogsActivity;
    protected $fillable = [
        'nip', 
        'nama_lengkap', 
        'jabatan', 
        'no_hp', 
        'email', 
        'alamat', 
        'is_active'
    ];
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll() 
            ->logOnlyDirty() 
            ->dontSubmitEmptyLogs()
            ->setDescriptionForEvent(fn(string $eventName) => "Data Guru: {$this->nama_lengkap} telah di-{$eventName}.");
    }
}