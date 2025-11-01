<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Student; 
use App\Models\Teacher;
use App\Models\Inventory;
use Illuminate\Support\Facades\Auth;
use Spatie\Activitylog\Models\Activity; 

class DashboardController extends Controller
{
    public function index()
    {
        $totals = [
            'siswa' => Student::count(),
            'guru' => Teacher::count(),
            'barang' => Inventory::count(),
        ];

        $activityLogs = Activity::query()
            ->where('causer_id', Auth::id())
            ->where('causer_type', 'App\Models\User') 
            ->latest()
            ->take(5)
            ->select('id', 'description', 'created_at') 
            ->get();
            
        return Inertia::render('Dashboard', [
            'totals' => $totals, 
            'activityLogs' => $activityLogs,
        ]);
    }
}