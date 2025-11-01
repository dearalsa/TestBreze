import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link } from '@inertiajs/react';
import { FaArrowLeft } from 'react-icons/fa';

export default function ShowInventories() {
  const { inventory } = usePage().props;

  if (!inventory) {
    return (
      <AuthenticatedLayout>
        <div className="container mx-auto py-8 px-4 md:px-0">
          <p className="text-center text-gray-500 text-lg">Data barang tidak ditemukan.</p>
          <div className="flex justify-center mt-4">
            <Link
              href={route('inventories.index')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Kembali
            </Link>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  const statusLabel =
    inventory.is_active != null
      ? inventory.is_active == 1 || inventory.is_active === '1'
        ? { text: 'Aktif', bg: 'bg-green-200', textColor: 'text-green-800' }
        : { text: 'Tidak Aktif', bg: 'bg-red-200', textColor: 'text-red-800' }
      : { text: '-', bg: 'bg-gray-200', textColor: 'text-gray-800' };

  return (
    <AuthenticatedLayout>
      <Head title={`Detail Barang - ${inventory.nama_barang ?? '-'}`} />

      <div className="container mx-auto py-8 px-4 md:px-0">
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h1 className="text-xl md:text-2xl font-semibold text-gray-800">Detail Barang</h1>
            <Link
              href={route('inventories.index')}
              className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-1 px-3 rounded-full text-sm transition"
            >
              <FaArrowLeft /> Kembali
            </Link>
          </div>

          <div className="p-6 space-y-3">
            <InfoRow label="ID" value={inventory.id ?? '-'} />
            <InfoRow label="Kode Barang" value={inventory.kode_barang ?? '-'} />
            <InfoRow label="Nama Barang" value={inventory.nama_barang ?? '-'} />
            <InfoRow
              label="Kategori"
              value={inventory.category?.category_name ?? '-'}
            />

            <InfoRow label="Jumlah Barang" value={inventory.jumlah_barang ?? '-'} />
            <InfoRow label="Status Barang" value={inventory.status ?? '-'} />
            <InfoRow label="Deskripsi" value={inventory.deskripsi ?? '-'} />
            <InfoRow label="Lokasi Barang" value={inventory.lokasi_barang ?? '-'} />
            <InfoRow
              label="Status Aktif/Tidak Aktif"
              value={
                <span
                  className={`inline-block ${statusLabel.bg} ${statusLabel.textColor} text-xs font-semibold px-2 py-1 rounded-full`}
                >
                  {statusLabel.text}
                </span>
              }
            />
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="font-medium text-gray-700">{label}</div>
      <div className="col-span-2 text-gray-800 text-sm">{value}</div>
    </div>
  );
}
