import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link } from '@inertiajs/react';
import { FaArrowLeft, FaRegUser } from 'react-icons/fa';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function Show() {
  const { student } = usePage().props;
  if (!student) {
    return (
      <AuthenticatedLayout>
        <div className="container mx-auto py-8 px-4 md:px-0 font-plusregular">
          <p className="text-center text-gray-500 text-lg">Data siswa tidak ditemukan.</p>
          <div className="flex justify-center mt-4">
            <Link
              href={route('students.index')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Kembali
            </Link>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  const formattedTanggalLahir = student.tanggal_lahir
    ? format(new Date(student.tanggal_lahir), 'dd MMMM yyyy', { locale: id })
    : '-';

  const statusLabel =
    student.is_active != null
      ? student.is_active == 1 || student.is_active === '1'
        ? { text: 'Aktif', bg: 'bg-green-200', textColor: 'text-green-800' }
        : { text: 'Tidak Aktif', bg: 'bg-red-200', textColor: 'text-red-800' }
      : { text: '-', bg: 'bg-gray-200', textColor: 'text-gray-800' };

  let fotoSrc = null;
  if (student.foto_wajah) {
    if (typeof student.foto_wajah === 'string') {
      fotoSrc = `/storage/${student.foto_wajah}`;
    } else if (typeof student.foto_wajah === 'object' && student.foto_wajah.path) {
      fotoSrc = `/storage/${student.foto_wajah.path}`;
    }
  }

  return (
    <AuthenticatedLayout>
      <Head title={`Data Lengkap Siswa - ${student.nama_lengkap || '-'}`} />
      <div className="container mx-auto py-8 px-4 md:px-0 font-plusregular">
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden max-w-3xl mx-auto">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h1 className="text-xl md:text-2xl font-plusmedium text-gray-800">Data Lengkap Siswa</h1>
            <Link
              href={route('students.index')}
              className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-plusmedium py-1 px-3 rounded-full text-sm transition"
            >
              <FaArrowLeft /> Kembali
            </Link>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex justify-center md:justify-start">
              {fotoSrc ? (
                <img
                  src={fotoSrc}
                  alt={student.nama_lengkap || 'Foto siswa'}
                  className="w-32 h-32 md:w-36 md:h-36 object-cover rounded-xl shadow-md border"
                  onError={(e) => {
                    e.currentTarget.src = '';
                  }}
                />
              ) : (
                <div className="w-32 h-32 md:w-36 md:h-36 flex items-center justify-center bg-gray-100 rounded-xl border text-gray-400 text-2xl">
                  <FaRegUser />
                </div>
              )}
            </div>

            <div className="md:col-span-2 space-y-2 md:space-y-3">
              <InfoRow label="ID" value={student.id ?? '-'} />
              <InfoRow label="NISN" value={student.nisn ?? '-'} />
              <InfoRow label="Nama Lengkap" value={student.nama_lengkap ?? '-'} />
              <InfoRow
                label="Tempat, Tanggal Lahir"
                value={`${student.tempat_lahir ?? '-'}, ${formattedTanggalLahir}`}
              />
              <InfoRow label="Alamat" value={student.alamat ?? '-'} />
              <InfoRow label="Angkatan" value={student.angkatan ?? '-'} />
              <InfoRow label="Jurusan" value={student.jurusan ?? '-'} />
              <InfoRow label="No HP" value={student.no_hp ?? '-'} />
              <InfoRow label="Added By" value={student.added_by ?? 'Admin'} />
              <InfoRow
                label="Status"
                value={
                  <span
                    className={`inline-block ${statusLabel.bg} ${statusLabel.textColor} text-xs font-plusmedium px-2 py-1 rounded-full`}
                  >
                    {statusLabel.text}
                  </span>
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
      <div className="font-plusmedium text-gray-700">{label}</div>
      <div className="col-span-2 text-gray-800 text-sm font-plusregular">{value}</div>
    </div>
  );
}
