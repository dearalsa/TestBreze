import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';

export default function Index() {
  const { teachers } = usePage().props;
  const [search, setSearch] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10); 

  // Filter data berdasarkan pencarian
  const filteredTeachers = teachers.filter(teacher =>
    teacher.nama_lengkap.toLowerCase().includes(search.toLowerCase())
  );

  // 🔽 Sorting A-Z berdasarkan nama_lengkap
  const sortedTeachers = [...filteredTeachers].sort((a, b) =>
    a.nama_lengkap.localeCompare(b.nama_lengkap, 'id', { sensitivity: 'base' })
  );

  // Data yang ditampilkan
  const displayedTeachers = sortedTeachers.slice(0, entriesPerPage);

  const handleDelete = (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus data guru ini?')) {
      router.delete(route('teachers.destroy', id));
    }
  };

  const handleEntriesChange = (e) => {
    setEntriesPerPage(Number(e.target.value));
  };

  return (
    <AuthenticatedLayout>
      <Head title="Daftar Guru" />
      <div className="container mx-auto py-8 px-4 md:px-0 font-comfortaa">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Daftar Guru</h1>
          
          <div className="flex gap-2 w-full md:w-auto items-center"> 
            <div className="flex items-center gap-2">
              <label htmlFor="entries" className="text-gray-600 text-sm md:text-base whitespace-nowrap">Tampilkan:</label>
              <select
                id="entries"
                value={entriesPerPage}
                onChange={handleEntriesChange}
                className="py-2 border border-gray-500 rounded-xl focus:ring-transparent focus:border-gray-500 text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={filteredTeachers.length}>Semua</option>
              </select>
            </div>

            <div className="relative w-full md:w-64">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nama guru..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-500 rounded-xl focus:ring-transparent focus:border-gray-500 w-64"
              />
            </div>
            <Link
              href={route('teachers.create')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl focus:outline-none focus:ring-0"
            >
              <FaPlus /> Tambah Guru
            </Link>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-2xl overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-base font-medium text-gray-500 capitalize tracking-wider">No</th>
                <th className="px-6 py-3 text-left text-base font-medium text-gray-500 capitalize tracking-wider">Nama</th>
                <th className="px-6 py-3 text-left text-base font-medium text-gray-500 capitalize tracking-wider">Nip</th>
                <th className="px-6 py-3 text-left text-base font-medium text-gray-500 capitalize tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-base font-medium text-gray-500 capitalize tracking-wider">Status</th>
                <th className="px-6 py-3 text-center text-base font-medium text-gray-500 capitalize tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayedTeachers.length ? displayedTeachers.map((teacher, index) => (
                <tr key={teacher.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{teacher.nama_lengkap}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{teacher.nip}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{teacher.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${teacher.is_active ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                      {teacher.is_active ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center items-center gap-2">
                      <Link
                        href={route('teachers.show', teacher.id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium py-1 px-2 rounded transition duration-200"
                      >
                        Detail
                      </Link>
                      <Link
                        href={route('teachers.edit', teacher.id)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white text-xs font-medium py-1 px-2 rounded transition duration-200"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(teacher.id)}
                        className="bg-red-500 hover:bg-red-600 text-white text-xs font-medium py-1 px-2 rounded transition duration-200"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">Data guru tidak ada.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 🔽 Tambahan: Info jumlah data ditampilkan */}
        <div className="mt-3 text-sm text-gray-600">
          Menampilkan {sortedTeachers.length === 0 ? 0 : 1} sampai{' '}
          {Math.min(entriesPerPage, sortedTeachers.length)} dari {sortedTeachers.length} data guru
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
