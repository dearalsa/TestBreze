import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({
    nisn: '',
    nama_lengkap: '',
    jenis_kelamin: '',
    foto_wajah: null,
    tempat_lahir: '',
    tanggal_lahir: '',
    alamat: '',
    jurusan: '',
    angkatan: '',
    no_hp: '',
    is_active: '', // status akan dikonversi ke angka
    added_by: '', 
  });

  const [preview, setPreview] = useState(null);
  const [formattedTanggal, setFormattedTanggal] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('students.store'));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setData('foto_wajah', file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  // Update format tanggal lahir saat user memilih tanggal
  useEffect(() => {
    if (data.tanggal_lahir) {
      const date = new Date(data.tanggal_lahir);
      setFormattedTanggal(format(date, 'dd MMMM yyyy', { locale: id }));
    } else {
      setFormattedTanggal('');
    }
  }, [data.tanggal_lahir]);

  const inputClass =
    'w-full border border-gray-300 rounded-xl p-3 bg-gray-50 text-base focus:outline-none focus:ring-0 focus:border-gray-300 focus:bg-gray-50 active:bg-gray-50';
  const fileClass =
    'w-full border border-gray-300 rounded-xl p-2.5 bg-gray-50 text-sm focus:outline-none focus:ring-0 focus:border-gray-300 focus:bg-gray-50 active:bg-gray-50';

  return (
    <AuthenticatedLayout>
      <Head title="Tambah Data Siswa" />
      <div className="w-full max-w-4xl mx-auto p-6 font-comfortaa">
        {/* Kembali */}
        <Link
          href={route('students.index')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
        >
          <FaArrowLeft /> Kembali ke Daftar Siswa
        </Link>

        <h2 className="text-3xl font-bold text-gray-800 mb-8">Tambah Data Siswa</h2>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-2xl p-6 space-y-6"
          encType="multipart/form-data"
        >
          {/* NISN & Nama */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">NISN</label>
              <input
                type="text"
                value={data.nisn}
                onChange={(e) => setData('nisn', e.target.value)}
                placeholder="Masukkan NISN"
                className={inputClass}
              />
              {errors.nisn && <p className="text-red-500 text-sm mt-1">{errors.nisn}</p>}
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Nama Lengkap</label>
              <input
                type="text"
                value={data.nama_lengkap}
                onChange={(e) => setData('nama_lengkap', e.target.value)}
                placeholder="Masukkan nama lengkap"
                className={inputClass}
              />
              {errors.nama_lengkap && <p className="text-red-500 text-sm mt-1">{errors.nama_lengkap}</p>}
            </div>
          </div>

          {/* Jenis Kelamin & Foto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Jenis Kelamin</label>
              <select
                value={data.jenis_kelamin}
                onChange={(e) => setData('jenis_kelamin', e.target.value)}
                className={inputClass}
              >
                <option value="">Pilih Jenis Kelamin</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
              {errors.jenis_kelamin && <p className="text-red-500 text-sm mt-1">{errors.jenis_kelamin}</p>}
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Foto Wajah</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className={fileClass}
              />
              {preview && (
                <img src={preview} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-xl border" />
              )}
              {errors.foto_wajah && <p className="text-red-500 text-sm mt-1">{errors.foto_wajah}</p>}
            </div>
          </div>

          {/* Tempat, Tanggal Lahir & Angkatan */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Tempat Lahir</label>
              <input
                type="text"
                value={data.tempat_lahir}
                onChange={(e) => setData('tempat_lahir', e.target.value)}
                placeholder="Masukkan tempat lahir"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Tanggal Lahir</label>
              <input
                type="date"
                value={data.tanggal_lahir}
                onChange={(e) => setData('tanggal_lahir', e.target.value)}
                className={inputClass}
              />
              {formattedTanggal && (
                <p className="text-gray-500 text-sm mt-1">Format: {formattedTanggal}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Angkatan</label>
              <input
                type="text"
                value={data.angkatan}
                onChange={(e) => setData('angkatan', e.target.value)}
                placeholder="Masukkan angkatan"
                className={inputClass}
              />
            </div>
          </div>

          {/* Jurusan & No HP */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Jurusan</label>
              <select
                value={data.jurusan}
                onChange={(e) => setData('jurusan', e.target.value)}
                className={inputClass}
              >
                <option value="">Pilih Jurusan</option>
                <option value="PPLG">PPLG</option>
                <option value="Animasi">Animasi</option>
                <option value="BCF">BCF</option>
                <option value="TPFL">TPFL</option>
                <option value="TO">TO</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">No HP</label>
              <input
                type="text"
                value={data.no_hp}
                onChange={(e) => setData('no_hp', e.target.value)}
                placeholder="Masukkan nomor HP"
                className={inputClass}
              />
            </div>
          </div>

          {/* Alamat */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Alamat</label>
            <textarea
              value={data.alamat}
              onChange={(e) => setData('alamat', e.target.value)}
              placeholder="Masukkan alamat"
              className={inputClass}
              rows={3}
            ></textarea>
          </div>

          {/* Status Aktif & Added By */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Status</label>
              <select
                value={data.is_active}
                onChange={(e) => setData('is_active', Number(e.target.value))} // <-- konversi ke angka
                className={inputClass}
              >
                <option value="">Pilih Status</option>
                <option value={1}>Aktif</option>
                <option value={0}>Tidak Aktif</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Added By</label>
              <input
                type="text"
                value={data.added_by}
                onChange={(e) => setData('added_by', e.target.value)}
                placeholder="Ditambahkan oleh"
                className={inputClass}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={processing}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-8 rounded-xl shadow disabled:opacity-50 text-base"
            >
              {processing ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </AuthenticatedLayout>
  );
}
