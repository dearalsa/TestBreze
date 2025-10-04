import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link } from '@inertiajs/react';
import { FaArrowLeft, FaUser, FaRegUser } from 'react-icons/fa';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function Show() {
  const { student } = usePage().props;

  const formattedTanggalLahir = student.tanggal_lahir
    ? format(new Date(student.tanggal_lahir), 'dd MMMM yyyy', { locale: id })
    : '-';

  return (
    <AuthenticatedLayout>
      <Head title={`Data Lengkap Siswa - ${student.nama_lengkap}`} />

      <div className="container mx-auto py-8 px-4 md:px-0">
        {/* Card */}
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden max-w-3xl mx-auto">
          
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h1 className="text-xl md:text-2xl font-semibold text-gray-800 flex items-center gap-2">
              <FaUser className="text-blue-600" /> Data Lengkap Siswa
            </h1>
            <Link
              href={route('students.index')}
              className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-1 px-3 rounded-full text-sm transition"
            >
              <FaArrowLeft /> Kembali
            </Link>
          </div>

          {/* Body */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Foto */}
            <div className="flex justify-center md:justify-start">
              {student.foto_wajah ? (
                <img
                  src={`/storage/${student.foto_wajah}`}
                  alt={student.nama_lengkap}
                  className="w-32 h-32 md:w-36 md:h-36 object-cover rounded-xl shadow-md border"
                />
              ) : (
                <div className="w-32 h-32 md:w-36 md:h-36 flex items-center justify-center bg-gray-100 rounded-xl border text-gray-400 text-2xl">
                  <FaRegUser />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="md:col-span-2 space-y-2 md:space-y-3">
              <InfoRow label="ID" value={student.id} />
              <InfoRow label="NISN" value={student.nisn} />
              <InfoRow label="Nama Lengkap" value={student.nama_lengkap} />
              <InfoRow
                label="Tempat, Tanggal Lahir"
                value={`${student.tempat_lahir ?? '-'}, ${formattedTanggalLahir}`}
              />
              <InfoRow label="Alamat" value={student.alamat ?? '-'} />
              <InfoRow label="Angkatan" value={student.angkatan ?? '-'} />
              <InfoRow label="Jurusan" value={student.jurusan ?? '-'} />
              <InfoRow label="No HP" value={student.no_hp ?? '-'} />
              <InfoRow label="Added By" value={student.added_by ?? '-'} />
              <InfoRow
                label="Status"
                value={
                  student.is_active === '1' ? (
                    <span className="inline-block bg-green-200 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                      Aktif
                    </span>
                  ) : (
                    <span className="inline-block bg-red-200 text-red-800 text-xs font-semibold px-2 py-1 rounded-full">
                      Tidak Aktif
                    </span>
                  )
                }
              />
            </div>
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
