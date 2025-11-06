<?php

namespace App\Http\Controllers;

use App\Models\Peminjaman;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\Inventory;
use Illuminate\Validation\ValidationException;
use Carbon\Carbon; 

class PeminjamanController extends Controller
{
    private function validateExistence(Request $request): void
    {
        if ($request->role === 'Siswa') {
            if (!Student::where('nisn', $request->peminjam_id)->exists()) {
                throw ValidationException::withMessages([
                    'peminjam_id' => 'ID Peminjam (NISN) tidak ditemukan di data Siswa.',
                ]);
            }
        } elseif ($request->role === 'Guru') {
            if (!Teacher::where('nip', $request->peminjam_id)->exists()) {
                throw ValidationException::withMessages([
                    'peminjam_id' => 'ID Peminjam (NIP) tidak ditemukan di data Guru.',
                ]);
            }
        } else {
            throw ValidationException::withMessages([
                'role' => 'Role peminjam tidak valid.',
            ]);
        }
        if (!Inventory::where('kode_barang', $request->barang_id)->exists()) {
            throw ValidationException::withMessages([
                'barang_id' => 'ID Barang (Kode Barang) tidak ditemukan di data Inventaris.',
            ]);
        }
    }
    public function index()
    {
        $peminjamen = Peminjaman::latest()->get();
        return Inertia::render('Peminjaman/Index', [
            'peminjamen' => $peminjamen,
            'auth' => ['user' => Auth::user()],
            'flash' => session()->get('success'),
        ]);
    }
    public function create()
    {
        return Inertia::render('Peminjaman/Create', [
            'auth' => ['user' => Auth::user()],
        ]);
    }
    public function store(Request $request)
    {
        $request->validate([
            'peminjam_id' => 'required|string',
            'role' => 'required|in:Siswa,Guru',
            'barang_id' => 'required|string',
            'tanggal_peminjam' => 'required|date',
            'tanggal_kembali' => 'required|date|after_or_equal:tanggal_peminjam',
            'keterangan' => 'nullable|string',
        ]);

        $this->validateExistence($request);

        $tanggalPeminjam = Carbon::parse($request->tanggal_peminjam)->toDateTimeString();
        $tanggalKembali = Carbon::parse($request->tanggal_kembali)->toDateTimeString();

        Peminjaman::create([
            'peminjam_id' => $request->peminjam_id,
            'role' => $request->role,
            'barang_id' => $request->barang_id,
            'tanggal_peminjam' => $tanggalPeminjam,
            'tanggal_kembali' => $tanggalKembali,
            'keterangan' => $request->keterangan,
            'added_by' => Auth::user()->name ?? Auth::id(), 
        ]);

        return redirect()->route('peminjaman.index')->with('success', 'Data peminjaman berhasil ditambahkan.');
    }
    public function show(Peminjaman $peminjaman)
    {
        return Inertia::render('Peminjaman/Show', [
            'peminjaman' => $peminjaman,
            'auth' => ['user' => Auth::user()],
        ]);
    }
    public function edit(Peminjaman $peminjaman)
    {
        return Inertia::render('Peminjaman/Edit', [
            'peminjaman' => $peminjaman,
            'auth' => ['user' => Auth::user()],
        ]);
    }
    public function update(Request $request, Peminjaman $peminjaman)
    {
        $request->validate([
            'peminjam_id' => 'required|string',
            'role' => 'required|in:Siswa,Guru',
            'barang_id' => 'required|string',
            'tanggal_peminjam' => 'required|date',
            'tanggal_kembali' => 'required|date|after_or_equal:tanggal_peminjam',
            'keterangan' => 'nullable|string',
        ]);
        
        $this->validateExistence($request);

        $tanggalPeminjam = Carbon::parse($request->tanggal_peminjam)->toDateTimeString();
        $tanggalKembali = Carbon::parse($request->tanggal_kembali)->toDateTimeString();
        
        $peminjaman->update([
            'peminjam_id' => $request->peminjam_id,
            'role' => $request->role,
            'barang_id' => $request->barang_id,
            'tanggal_peminjam' => $tanggalPeminjam,
            'tanggal_kembali' => $tanggalKembali, 
            'keterangan' => $request->keterangan,
        ]);

        return redirect()->route('peminjaman.index')->with('success', 'Data peminjaman berhasil diperbarui.');
    }
    public function destroy(Peminjaman $peminjaman)
    {
        $peminjaman->delete();
        return redirect()->route('peminjaman.index')->with('success', 'Data peminjaman berhasil dihapus.');
    }
    public function checkPeminjam($role, $id)
    {
        if ($role === 'Siswa') {
            $peminjam = Student::where('nisn', $id)->first();
            if ($peminjam) {
                return response()->json(['status' => true, 'message' => 'Siswa ditemukan', 'data' => ['nama_lengkap' => $peminjam->nama_lengkap]]);
            }
            return response()->json(['status' => false, 'message' => 'NISN tidak ditemukan.']);
        } elseif ($role === 'Guru') {
            $peminjam = Teacher::where('nip', $id)->first();
            if ($peminjam) {
                return response()->json(['status' => true, 'message' => 'Guru ditemukan', 'data' => ['nama_lengkap' => $peminjam->nama_lengkap]]);
            }
            return response()->json(['status' => false, 'message' => 'NIP tidak ditemukan.']);
        }

        return response()->json(['status' => false, 'message' => 'Role tidak valid.']);
    }
    public function checkBarang($id)
    {
        $barang = Inventory::where('kode_barang', $id)->first();
        if ($barang) {
            return response()->json(['status' => true, 'message' => 'Barang ditemukan', 'data' => ['nama_barang' => $barang->nama_barang]]);
        }
        return response()->json(['status' => false, 'message' => 'Kode Barang tidak ditemukan.']);
    }
}