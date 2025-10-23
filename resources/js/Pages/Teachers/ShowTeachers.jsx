import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link } from '@inertiajs/react';
import { FaArrowLeft } from 'react-icons/fa';

export default function ShowTeachers() {
  const { teacher } = usePage().props;

  if (!teacher) {
    return (
      <AuthenticatedLayout>
        <div className="container mx-auto py-8 px-4 md:px-0">
          <p className="text-center text-gray-500 text-lg">Data guru tidak ditemukan.</p>
          <div className="flex justify-center mt-4">
            <Link
              href={route('teachers.index')}
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
    teacher.is_active != null
      ? teacher.is_active == 1 || teacher.is_active === '1'
        ? { text: 'Aktif', bg: 'bg-green-200', textColor: 'text-green-800' }
        : { text: 'Tidak Aktif', bg: 'bg-red-200', textColor: 'text-red-800' }
      : { text: '-', bg: 'bg-gray-200', textColor: 'text-gray-800' };

  return (
    <AuthenticatedLayout>
      <Head title={`Data Lengkap Guru - ${teacher.nama_lengkap ?? '-'}`} />

      <div className="container mx-auto py-8 px-4 md:px-0">
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h1 className="text-xl md:text-2xl font-semibold text-gray-800">Data Lengkap Guru</h1>
            <Link
              href={route('teachers.index')}
              className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-1 px-3 rounded-full text-sm transition"
            >
              <FaArrowLeft /> Kembali
            </Link>
          </div>

          {/* Body */}
          <div className="p-6 space-y-3">
            <InfoRow label="ID" value={teacher.id ?? '-'} />
            <InfoRow label="NIP" value={teacher.nip ?? '-'} />
            <InfoRow label="Nama Lengkap" value={teacher.nama_lengkap ?? '-'} />
            <InfoRow label="Jabatan" value={teacher.jabatan ?? '-'} />
            <InfoRow label="No HP" value={teacher.no_hp ?? '-'} />
            <InfoRow label="Email" value={teacher.email ?? '-'} />
            <InfoRow label="Alamat" value={teacher.alamat ?? '-'} />
            <InfoRow
              label="Status"
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
