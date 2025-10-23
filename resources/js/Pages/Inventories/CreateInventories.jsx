import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { FaArrowLeft } from 'react-icons/fa';

export default function CreateInventories() {
  const { data, setData, post, processing, errors, reset } = useForm({
    kode_barang: '',
    nama_barang: '',
    kategori: '',
    jumlah_barang: '', 
    deskripsi: '',
    status: '', 
    lokasi_barang: '',
    is_active: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('inventories.store'), {
      preserveScroll: true,
      onSuccess: () => reset(),
    });
  };

  const inputClass =
    'w-full border border-gray-300 rounded-xl p-3 bg-gray-50 text-base focus:outline-none focus:ring-0 focus:border-gray-300 focus:bg-gray-50 active:bg-gray-50';

  const kategoriOptions = [
    { value: '', label: 'Pilih Kategori' },
    { value: 'Elektronik', label: 'Elektronik' },
    { value: 'Perabotan', label: 'Perabotan' },
    { value: 'Alat Tulis', label: 'Alat Tulis' },
    { value: 'Kendaraan', label: 'Kendaraan' },
    { value: 'Lain-lain', label: 'Lain-lain' },
  ];

  const statusOptions = [
    { value: '', label: 'Pilih Status' },
    { value: 'Baru', label: 'Baru' },
    { value: 'Bekas', label: 'Bekas' },
    { value: 'Rusak', label: 'Rusak' },
  ];

  return (
    <AuthenticatedLayout>
      <Head title="Tambah Barang" />
      <div className="max-w-4xl mx-auto p-6">
        <Link
          href={route('inventories.index')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
        >
          <FaArrowLeft /> Kembali ke Daftar Barang
        </Link>

        <h2 className="text-3xl font-bold text-gray-800 mb-6">Tambah Barang Baru</h2>

        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-2xl p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Kode Barang</label>
              <input
                type="text"
                placeholder="Masukkan kode barang"
                value={data.kode_barang}
                onChange={(e) => setData('kode_barang', e.target.value)}
                className={inputClass}
              />
              {errors.kode_barang && <p className="text-red-500 text-sm mt-1">{errors.kode_barang}</p>}
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Nama Barang</label>
              <input
                type="text"
                placeholder="Masukkan nama barang"
                value={data.nama_barang}
                onChange={(e) => setData('nama_barang', e.target.value)}
                className={inputClass}
              />
              {errors.nama_barang && <p className="text-red-500 text-sm mt-1">{errors.nama_barang}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Kategori</label>
              <select
                value={data.kategori}
                onChange={(e) => setData('kategori', e.target.value)}
                className={inputClass}
              >
                {kategoriOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.kategori && <p className="text-red-500 text-sm mt-1">{errors.kategori}</p>}
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Jumlah Barang</label>
              <input
                type="number"
                placeholder="Masukkan jumlah barang"
                value={data.jumlah_barang}
                onChange={(e) => setData('jumlah_barang', e.target.value)}
                className={inputClass}
                min="1" 
              />
              {errors.jumlah_barang && <p className="text-red-500 text-sm mt-1">{errors.jumlah_barang}</p>}
            </div>
          </div>
          
          {/* Status field changed to select */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Status</label>
            <select
              value={data.status}
              onChange={(e) => setData('status', e.target.value)}
              className={inputClass}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Deskripsi</label>
            <textarea
              placeholder="Masukkan deskripsi barang"
              value={data.deskripsi}
              onChange={(e) => setData('deskripsi', e.target.value)}
              className={inputClass}
              rows={3}
            ></textarea>
            {errors.deskripsi && <p className="text-red-500 text-sm mt-1">{errors.deskripsi}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Lokasi Barang</label>
            <input
              type="text"
              placeholder="Masukkan lokasi barang"
              value={data.lokasi_barang}
              onChange={(e) => setData('lokasi_barang', e.target.value)}
              className={inputClass}
            />
            {errors.lokasi_barang && <p className="text-red-500 text-sm mt-1">{errors.lokasi_barang}</p>}
          </div>

          <div>
            <label className="block mb-1 font-semibold">Status Aktif/Tidak Aktif</label>
            <select
              value={data.is_active}
              onChange={(e) => setData('is_active', Number(e.target.value))}
              className={inputClass}
            >
              <option value="">Pilih Status</option>
              <option value={1}>Aktif</option>
              <option value={0}>Tidak Aktif</option>
            </select>
            {errors.is_active && <p className="text-red-500 text-sm mt-1">{errors.is_active}</p>}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={processing}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl disabled:opacity-50"
            >
              {processing ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </AuthenticatedLayout>
  );
}