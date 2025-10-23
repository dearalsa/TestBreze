<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $students = Student::with('addedBy')
            ->when($search, function ($query, $search) {
                return $query->where('nama_lengkap', 'like', "%{$search}%")
                             ->orWhere('nisn', 'like', "%{$search}%")
                             ->orWhere('jurusan', 'like', "%{$search}%")
                             ->orWhere('angkatan', 'like', "%{$search}%");
            })
            ->orderBy('id', 'desc')
            ->get();

        return Inertia::render('Students/Index', [
            'students' => $students,
            'filters' => ['search' => $search],
            'flash' => ['success' => session('success')],
        ]);
    }

    public function create()
    {
        return Inertia::render('Students/Create', [
            'user' => Auth::user(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nisn' => 'required|unique:students,nisn',
            'nama_lengkap' => 'required|string|max:255',
            'jenis_kelamin' => 'required|string',
            'foto_wajah' => 'nullable|image',
            'tempat_lahir' => 'nullable|string',
            'tanggal_lahir' => 'nullable|date',
            'alamat' => 'nullable|string',
            'jurusan' => 'nullable|string',
            'angkatan' => 'nullable|string',
            'no_hp' => 'nullable|string',
            'is_active' => 'nullable|boolean',
        ]);

        $data = $request->except('added_by');
        $data['added_by'] = Auth::id();
        $data['is_active'] = $request->has('is_active') ? (int)$request->is_active : 0;

        if ($request->hasFile('foto_wajah')) {
            $file = $request->file('foto_wajah');
            $data['foto_wajah'] = $file->store('students', 'public');
        }

        Student::create($data);

        return redirect()->route('students.index')
            ->with('success', 'Data siswa berhasil ditambahkan!');
    }

    public function show(Student $student)
    {
        // Pastikan relasi addedBy dimuat, fallback jika null
        $student->loadMissing('addedBy');

        return Inertia::render('Students/Show', [
            'student' => [
                'id' => $student->id,
                'nisn' => $student->nisn,
                'nama_lengkap' => $student->nama_lengkap,
                'jenis_kelamin' => $student->jenis_kelamin,
                'foto_wajah' => $student->foto_wajah,
                'tempat_lahir' => $student->tempat_lahir,
                'tanggal_lahir' => $student->tanggal_lahir,
                'alamat' => $student->alamat,
                'jurusan' => $student->jurusan,
                'angkatan' => $student->angkatan,
                'no_hp' => $student->no_hp,
                'is_active' => $student->is_active,
                'added_by' => $student->addedBy ? $student->addedBy->name : 'System',
            ],
        ]);
    }

    public function edit(Student $student)
    {
        $student->loadMissing('addedBy');

        return Inertia::render('Students/Edit', [
            'student' => $student,
            'user' => Auth::user(),
        ]);
    }

    public function update(Request $request, Student $student)
    {
        $request->validate([
            'nisn' => 'required|unique:students,nisn,' . $student->id,
            'nama_lengkap' => 'required|string|max:255',
            'jenis_kelamin' => 'required|string',
            'foto_wajah' => 'nullable|image',
            'tempat_lahir' => 'nullable|string',
            'tanggal_lahir' => 'nullable|date',
            'alamat' => 'nullable|string',
            'jurusan' => 'nullable|string',
            'angkatan' => 'nullable|string',
            'no_hp' => 'nullable|string',
            'is_active' => 'nullable|boolean',
        ]);

        $data = $request->except('added_by');
        $data['is_active'] = $request->has('is_active') ? (int)$request->is_active : 0;

        if ($request->hasFile('foto_wajah')) {
            if ($student->foto_wajah) {
                Storage::disk('public')->delete($student->foto_wajah);
            }
            $file = $request->file('foto_wajah');
            $data['foto_wajah'] = $file->store('students', 'public');
        }

        $student->update($data);

        return redirect()->route('students.index')
            ->with('success', 'Data siswa berhasil diupdate!');
    }

    public function destroy(Student $student)
    {
        if ($student->foto_wajah) {
            Storage::disk('public')->delete($student->foto_wajah);
        }

        $student->delete();

        return redirect()->route('students.index')
            ->with('success', 'Data siswa berhasil dihapus!');
    }
}
