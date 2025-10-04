import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function Edit() {
  const { student } = usePage().props;

  const { data, setData, put, processing, errors } = useForm({
    nisn: student.nisn || '',
    nama_lengkap: student.nama_lengkap || '',
    jenis_kelamin: student.jenis_kelamin || '',
    foto_wajah: null,
    tempat_lahir: student.tempat_lahir || '',
    tanggal_lahir: student.tanggal_lahir || '',
    alamat: student.alamat || '',
    jurusan: student.jurusan || '',
    angkatan: student.angkatan || '',
    no_hp: student.no_hp || '',
    is_active: student.is_active ? 1 : 0,
    added_by: student.added_by || '',
  });

  const [preview, setPreview] = useState(null);
  const [formattedTanggal, setFormattedTanggal] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    put(route('students.update', student.id));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setData('foto_wajah', file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  useEffect(() => {
    if (data.tanggal_lahir) {
      setFormattedTanggal(format(new Date(data.tanggal_lahir), 'dd MMMM yyyy', { locale: id }));
    } else setFormattedTanggal('');
  }, [data.tanggal_lahir]);

  const inputClass = 'w-full border border-gray-300 rounded-xl p-3 bg-gray-50 focus:outline-none';
  const fileClass = 'w-full border border-gray-300 rounded-xl p-2.5 bg-gray-50 focus:outline-none';

  return (
    <AuthenticatedLayout>
      <Head title={`Edit Data - ${student.nama_lengkap}`} />
      <div className="w-full max-w-4xl mx-auto p-6 font-comfortaa">
        <Link href={route('students.index')} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6">
          <FaArrowLeft /> Kembali ke Daftar Siswa
        </Link>

        <h2 className="text-3xl font-bold text-gray-800 mb-8">Edit Data Siswa</h2>

        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-2xl p-6 space-y-6" encType="multipart/form-data">
          
          {/* NISN & Nama */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label>NISN</label>
              <input type="text" value={data.nisn} onChange={e => setData('nisn', e.target.value)} className={inputClass} />
              {errors.nisn && <p className="text-red-500 text-sm">{errors.nisn}</p>}
            </div>
            <div>
              <label>Nama Lengkap</label>
              <input type="text" value={data.nama_lengkap} onChange={e => setData('nama_lengkap', e.target.value)} className={inputClass} />
              {errors.nama_lengkap && <p className="text-red-500 text-sm">{errors.nama_lengkap}</p>}
            </div>
          </div>

          {/* Jenis Kelamin & Foto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label>Jenis Kelamin</label>
              <select value={data.jenis_kelamin} onChange={e => setData('jenis_kelamin', e.target.value)} className={inputClass}>
                <option value="">-- Pilih Jenis Kelamin --</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
            <div>
              <label>Foto Wajah</label>
              <input type="file" accept="image/*" onChange={handleFileChange} className={fileClass} />
              {(preview || student.foto_wajah) && (
                <img src={preview || `/storage/${student.foto_wajah}`} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-xl border" />
              )}
            </div>
          </div>

          {/* Tempat, Tanggal, Angkatan */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label>Tempat Lahir</label>
              <input type="text" value={data.tempat_lahir} onChange={e => setData('tempat_lahir', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label>Tanggal Lahir</label>
              <input type="date" value={data.tanggal_lahir} onChange={e => setData('tanggal_lahir', e.target.value)} className={inputClass} />
              {formattedTanggal && <p className="text-gray-500 text-sm">Format: {formattedTanggal}</p>}
            </div>
            <div>
              <label>Angkatan</label>
              <input type="text" value={data.angkatan} onChange={e => setData('angkatan', e.target.value)} className={inputClass} />
            </div>
          </div>

          {/* Jurusan & No HP */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label>Jurusan</label>
              <select value={data.jurusan} onChange={e => setData('jurusan', e.target.value)} className={inputClass}>
                <option value="">-- Pilih Jurusan --</option>
                <option value="PPLG">PPLG</option>
                <option value="Animasi">Animasi</option>
                <option value="BCF">BCF</option>
                <option value="TPFL">TPFL</option>
                <option value="TO">TO</option>
              </select>
            </div>
            <div>
              <label>No HP</label>
              <input type="text" value={data.no_hp} onChange={e => setData('no_hp', e.target.value)} className={inputClass} />
            </div>
          </div>

          {/* Alamat */}
          <div>
            <label>Alamat</label>
            <textarea value={data.alamat} onChange={e => setData('alamat', e.target.value)} className={inputClass} rows={3}></textarea>
          </div>

          {/* Status & Added By */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label>Status</label>
              <select value={data.is_active} onChange={e => setData('is_active', Number(e.target.value))} className={inputClass}>
                <option value={1}>Aktif</option>
                <option value={0}>Tidak Aktif</option>
              </select>
            </div>
            <div>
              <label>Added By</label>
              <input type="text" value={data.added_by} onChange={e => setData('added_by', e.target.value)} className={inputClass} />
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-8 rounded-xl">
              {processing ? 'Menyimpan...' : 'Update'}
            </button>
          </div>

        </form>
      </div>
    </AuthenticatedLayout>
  );
}
