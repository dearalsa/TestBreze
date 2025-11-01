<?php

namespace App\Http\Controllers;

use App\Models\Teacher;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeacherController extends Controller
{
    // Tampilkan semua guru
    public function index()
    {
        $teachers = Teacher::all();
        return Inertia::render('Teachers/IndexTeachers', [
            'teachers' => $teachers,
        ]);
    }

    // Tampilkan form tambah guru
    public function create()
    {
        return Inertia::render('Teachers/CreateTeachers');
    }

    // Simpan data guru baru
    public function store(Request $request)
    {
        // FIX: Menambahkan validasi untuk no_hp, alamat, dan is_active
        $validated = $request->validate([
            'nip' => 'required|unique:teachers',
            'nama_lengkap' => 'required',
            'jabatan' => 'required',
            'no_hp' => 'nullable|string|max:15', // Ditambahkan: nullable karena di DB nullable
            'email' => 'required|email|unique:teachers',
            'alamat' => 'nullable|string',      // Ditambahkan: nullable karena di DB nullable
            'is_active' => 'required|boolean',  // Ditambahkan
        ]);

        Teacher::create($validated);

        return redirect()->route('teachers.index')->with('success', 'Teacher created successfully.');
    }

    // Tampilkan detail guru
    public function show(Teacher $teacher)
    {
        return Inertia::render('Teachers/ShowTeachers', [
            'teacher' => $teacher,
        ]);
    }

    public function edit($id)
    {
        $teacher = Teacher::findOrFail($id);
        return Inertia::render('Teachers/EditTeachers', [
            'teacher' => $teacher
        ]);
    }

    public function update(Request $request, Teacher $teacher)
    {
        $validated = $request->validate([
            'nip' => 'required|unique:teachers,nip,' . $teacher->id,
            'nama_lengkap' => 'required',
            'jabatan' => 'required',
            'no_hp' => 'nullable|string|max:15', 
            'email' => 'required|email|unique:teachers,email,' . $teacher->id,
            'alamat' => 'nullable|string',      
            'is_active' => 'required|boolean',  
        ]);

        $teacher->update($validated);

        return redirect()->route('teachers.index')->with('success', 'Teacher updated successfully.');
    }

    public function destroy(Teacher $teacher)
    {
        $teacher->delete();
        return redirect()->route('teachers.index')->with('success', 'Teacher deleted successfully.');
    }
}
