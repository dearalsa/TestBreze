<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $students = Student::when($search, function ($query, $search) {
            return $query->where('nama_lengkap', 'like', "%{$search}%")
                         ->orWhere('nisn', 'like', "%{$search}%")
                         ->orWhere('jurusan', 'like', "%{$search}%")
                         ->orWhere('angkatan', 'like', "%{$search}%");
        })->orderBy('id', 'desc')->get();

        return Inertia::render('Students/Index', [
            'students' => $students,
            'filters' => ['search' => $search],
            'flash' => ['success' => session('success')],
        ]);
    }

    public function create()
    {
        return Inertia::render('Students/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'nisn' => 'required|unique:students,nisn',
            'nama_lengkap' => 'required',
            'jenis_kelamin' => 'required',
            'foto_wajah' => 'nullable|image',
            'tempat_lahir' => 'nullable|string',
            'tanggal_lahir' => 'nullable|date',
            'alamat' => 'nullable|string',
            'jurusan' => 'nullable|string',
            'angkatan' => 'nullable|string',
            'no_hp' => 'nullable|string',
            'added_by' => 'nullable|string',
            'is_active' => 'nullable|boolean',
        ]);

        $data = $request->all();

        // Pastikan is_active selalu 1 atau 0
        $data['is_active'] = $request->has('is_active') ? (int)$request->is_active : 0;

        // Upload foto jika ada
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
        return Inertia::render('Students/Show', [
            'student' => $student
        ]);
    }

    public function edit(Student $student)
    {
        return Inertia::render('Students/Edit', [
            'student' => $student
        ]);
    }

    public function update(Request $request, Student $student)
    {
        $request->validate([
            'nisn' => 'required|unique:students,nisn,' . $student->id,
            'nama_lengkap' => 'required',
            'jenis_kelamin' => 'required',
            'foto_wajah' => 'nullable|image',
            'tempat_lahir' => 'nullable|string',
            'tanggal_lahir' => 'nullable|date',
            'alamat' => 'nullable|string',
            'jurusan' => 'nullable|string',
            'angkatan' => 'nullable|string',
            'no_hp' => 'nullable|string',
            'added_by' => 'nullable|string',
            'is_active' => 'nullable|boolean',
        ]);

        $data = $request->all();

        // Pastikan is_active selalu 1 atau 0
        $data['is_active'] = $request->has('is_active') ? (int)$request->is_active : 0;

        // Upload foto baru jika ada, hapus foto lama
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
