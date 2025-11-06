import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { FaArrowLeft } from 'react-icons/fa';

export default function EditPeminjaman({ peminjaman }) {
  const { data, setData, put, processing, errors } = useForm({
    peminjam_id: peminjaman.peminjam_id || '',
    role: peminjaman.role || '',
    barang_id: peminjaman.barang_id || '',
    tanggal_peminjam: peminjaman.tanggal_peminjam ? peminjaman.tanggal_peminjam.replace(' ', 'T') : '',
    tanggal_kembali: peminjaman.tanggal_kembali ? peminjaman.tanggal_kembali.replace(' ', 'T') : '',
    keterangan: peminjaman.keterangan || '',
  });

  function submit(e) {
    e.preventDefault();
    put(route('peminjaman.update', peminjaman.id));
  }

  const inputClass =
    'w-full border border-gray-300 rounded-xl p-3 bg-gray-50 text-base font-plusregular focus:outline-none focus:ring-0 focus:border-gray-300';

  return (
    <AuthenticatedLayout>
      <Head title="Edit Peminjaman" />
      <div className="max-w-4xl mx-auto p-6">
        <Link
          href={route('peminjaman.index')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 font-plusmedium"
        >
          <FaArrowLeft /> Kembali ke Daftar Peminjaman
        </Link>

        <h2 className="text-3xl font-plusmedium text-gray-800 mb-6">
          Edit Peminjaman
        </h2>

        <form onSubmit={submit} className="bg-white shadow-md rounded-2xl p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-plusmedium mb-1">Jenis Peminjam</label>
              <select
                value={data.role}
                onChange={(e) => setData('role', e.target.value)}
                className={inputClass}
              >
                <option value="">-- Pilih --</option>
                <option value="Siswa">Siswa</option>
                <option value="Guru">Guru</option>
              </select>
              {errors.role && (
                <p className="text-red-500 text-sm mt-1 font-plusregular">{errors.role}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-plusmedium mb-1">ID Peminjam</label>
              <input
                type="text"
                value={data.peminjam_id}
                onChange={(e) => setData('peminjam_id', e.target.value)}
                className={inputClass}
              />
              {errors.peminjam_id && (
                <p className="text-red-500 text-sm mt-1 font-plusregular">{errors.peminjam_id}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 font-plusmedium mb-1">Barang yang Dipinjam</label>
              <input
                type="text"
                value={data.barang_id}
                onChange={(e) => setData('barang_id', e.target.value)}
                className={inputClass}
              />
              {errors.barang_id && (
                <p className="text-red-500 text-sm mt-1 font-plusregular">{errors.barang_id}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-plusmedium mb-1">Tanggal & Waktu Pinjam</label>
              <input
                type="datetime-local"
                value={data.tanggal_peminjam}
                onChange={(e) => setData('tanggal_peminjam', e.target.value)}
                className={inputClass}
              />
              {errors.tanggal_peminjam && (
                <p className="text-red-500 text-sm mt-1 font-plusregular">{errors.tanggal_peminjam}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-plusmedium mb-1">Tanggal & Waktu Kembali</label>
              <input
                type="datetime-local"
                value={data.tanggal_kembali}
                onChange={(e) => setData('tanggal_kembali', e.target.value)}
                className={inputClass}
              />
              {errors.tanggal_kembali && (
                <p className="text-red-500 text-sm mt-1 font-plusregular">{errors.tanggal_kembali}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 font-plusmedium mb-1">Keterangan</label>
              <textarea
                value={data.keterangan}
                onChange={(e) => setData('keterangan', e.target.value)}
                className={inputClass}
                rows={3}
              />
              {errors.keterangan && (
                <p className="text-red-500 text-sm mt-1 font-plusregular">{errors.keterangan}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="submit"
              disabled={processing}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white font-plusmedium disabled:opacity-50"
            >
              {processing ? 'Menyimpan...' : 'Perbarui Data'}
            </button>
          </div>
        </form>
      </div>
    </AuthenticatedLayout>
  );
}
