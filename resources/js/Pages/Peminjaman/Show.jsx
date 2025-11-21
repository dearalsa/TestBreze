import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { FaArrowLeft } from 'react-icons/fa';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/id';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('id');

export default function ShowPeminjaman({ peminjaman }) {
  if (!peminjaman) {
    return (
      <AuthenticatedLayout>
        <div className="container mx-auto py-8 px-4 md:px-0">
          <p className="text-center text-gray-500 text-lg font-plusregular">
            Data peminjaman tidak ditemukan.
          </p>
          <div className="flex justify-center mt-4">
            <Link
              href={route('peminjaman.index')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded font-plusmedium text-base"
            >
              Kembali
            </Link>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  const formatDate = (date) => {
    if (!date) return '-';
    return dayjs.utc(date).tz('Asia/Jakarta').format('DD MMMM YYYY, HH:mm [WIB]');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'dipinjam':
        return <span className="px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-yellow-100 text-yellow-800">Dipinjam</span>;
      case 'dikembalikan':
        return <span className="px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-green-100 text-green-800">Dikembalikan</span>;
      case 'expired':
        return <span className="px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-red-100 text-red-800">Expired</span>;
      default:
        return <span className="px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title={`Detail Peminjaman - ${peminjaman.peminjam_id ?? '-'}`} />
      <div className="container mx-auto py-10 px-4 md:px-0">
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden max-w-3xl mx-auto">
          <div className="flex items-center justify-between p-5 border-b border-gray-200">
            <h1 className="text-2xl md:text-3xl font-plusmedium text-gray-800">
              Detail Peminjaman
            </h1>
            <Link
              href={route('peminjaman.index')}
              className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-plusmedium py-2 px-4 rounded-full text-base transition"
            >
              <FaArrowLeft /> Kembali
            </Link>
          </div>

          <div className="p-8 space-y-4">
            <InfoRow label="ID Peminjam" value={peminjaman.peminjam_id ?? '-'} />
            <InfoRow label="Role" value={peminjaman.role ?? '-'} />
            <InfoRow label="Barang yang Dipinjam" value={peminjaman.barang_id ?? '-'} />
            
            <div className="grid grid-cols-3 gap-3">
              <div className="font-plusmedium text-lg text-gray-700">Status</div>
              <div className="col-span-2 text-gray-800 text-base font-plusregular">
                {getStatusBadge(peminjaman.status)}
              </div>
            </div>

            <InfoRow label="Tanggal Pinjam" value={formatDate(peminjaman.tanggal_peminjam)} />
            <InfoRow label="Tanggal Kembali" value={formatDate(peminjaman.tanggal_kembali)} />
            <InfoRow label="Pengembalian" value={peminjaman.tanggal_pengembalian ? formatDate(peminjaman.tanggal_pengembalian) : '-'} />
            <InfoRow label="Keterangan" value={peminjaman.keterangan ?? '-'} />
            <InfoRow label="Added By" value={peminjaman.added_by ?? '-'} />
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="font-plusmedium text-lg text-gray-700">{label}</div>
      <div className="col-span-2 text-gray-800 text-base font-plusregular">{value}</div>
    </div>
  );
}