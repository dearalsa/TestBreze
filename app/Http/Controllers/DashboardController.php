<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Teacher;
use App\Models\Inventory;
use App\Models\Category;
use Spatie\Activitylog\Models\Activity;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $totals = [
            'siswa' => Student::count(),
            'guru' => Teacher::count(),
            'barang' => Inventory::count(),
            'kategori' => Category::count(),
        ];

        $activityLogs = Activity::where('causer_id', auth()->id())
            ->latest()
            ->take(5)
            ->get(['id', 'description', 'created_at']);

        return Inertia::render('Dashboard', [
            'auth' => [
                'user' => auth()->user(),
            ],
            'totals' => $totals,
            'activityLogs' => $activityLogs,
        ]);
    }
}
