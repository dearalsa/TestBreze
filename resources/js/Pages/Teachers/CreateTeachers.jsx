import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { FaArrowLeft } from 'react-icons/fa';

export default function CreateTeachers() {
  const { data, setData, post, processing, errors, reset } = useForm({
    nip: '',
    nama_lengkap: '',
    jabatan: '',
    no_hp: '',
    email: '',
    alamat: '',
    is_active: '', 
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('teachers.store'), {
      preserveScroll: true,
      onSuccess: () => reset(),
    });
  };

  const inputClass =
    'w-full border border-gray-300 rounded-xl p-3 bg-gray-50 text-base font-plusregular focus:outline-none focus:ring-0 focus:border-gray-300 focus:bg-gray-50 active:bg-gray-50';

  return (
    <AuthenticatedLayout>
      <Head title="Tambah Guru" />
      <div className="max-w-4xl mx-auto p-6">
        <Link
          href={route('teachers.index')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 font-plusmedium"
        >
          <FaArrowLeft /> Kembali ke Daftar Guru
        </Link>

        <h2 className="text-3xl font-plusmedium text-gray-800 mb-6">Tambah Guru Baru</h2>

        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-2xl p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-plusmedium mb-1">NIP</label>
              <input
                type="text"
                value={data.nip}
                placeholder="Masukkan NIP"
                onChange={e => setData('nip', e.target.value)}
                className={inputClass}
              />
              {errors.nip && <p className="text-red-500 text-sm mt-1 font-plusregular">{errors.nip}</p>}
            </div>

            <div>
              <label className="block text-gray-700 font-plusmedium mb-1">Nama Lengkap</label>
              <input
                type="text"
                placeholder="Masukkan nama lengkap"
                value={data.nama_lengkap}
                onChange={e => setData('nama_lengkap', e.target.value)}
                className={inputClass}
              />
              {errors.nama_lengkap && <p className="text-red-500 text-sm mt-1 font-plusregular">{errors.nama_lengkap}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-plusmedium mb-1">Jabatan</label>
              <input
                type="text"
                placeholder="Masukkan Jabatan"
                value={data.jabatan}
                onChange={e => setData('jabatan', e.target.value)}
                className={inputClass}
              />
              {errors.jabatan && <p className="text-red-500 text-sm mt-1 font-plusregular">{errors.jabatan}</p>}
            </div>

            <div>
              <label className="block text-gray-700 font-plusmedium mb-1">No HP</label>
              <input
                type="text"
                placeholder="Masukkan nomor HP"
                value={data.no_hp}
                onChange={e => setData('no_hp', e.target.value)}
                className={inputClass}
              />
              {errors.no_hp && <p className="text-red-500 text-sm mt-1 font-plusregular">{errors.no_hp}</p>}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-plusmedium mb-1">Email</label>
            <input
              type="email"
              placeholder="Masukkan email"
              value={data.email}
              onChange={e => setData('email', e.target.value)}
              className={inputClass}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1 font-plusregular">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-plusmedium mb-1">Alamat</label>
            <textarea
              value={data.alamat}
              placeholder="Masukkan Alamat"
              onChange={e => setData('alamat', e.target.value)}
              className={inputClass}
              rows={3}
            ></textarea>
            {errors.alamat && <p className="text-red-500 text-sm mt-1 font-plusregular">{errors.alamat}</p>}
          </div>

          <div>
            <label className="block mb-1 font-plusmedium">Status</label>
            <select
              value={data.is_active}
              onChange={e => setData('is_active', Number(e.target.value))}
              className={inputClass}
            >
              <option value="">Pilih Status</option>
              <option value={1}>Aktif</option>
              <option value={0}>Tidak Aktif</option>
            </select>
            {errors.is_active && <p className="text-red-500 text-sm mt-1 font-plusregular">{errors.is_active}</p>}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={processing}
              className="bg-blue-600 hover:bg-blue-700 text-white font-plusmedium py-2 px-6 rounded-xl disabled:opacity-50"
            >
              {processing ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </AuthenticatedLayout>
  );
}
