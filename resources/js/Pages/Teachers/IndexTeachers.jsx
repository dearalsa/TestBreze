import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Index() {
  const { teachers } = usePage().props;
  const [search, setSearch] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.nama_lengkap.toLowerCase().includes(search.toLowerCase())
  );

  const sortedTeachers = [...filteredTeachers].sort((a, b) =>
    a.nama_lengkap.localeCompare(b.nama_lengkap, 'id', { sensitivity: 'base' })
  );

  const displayedTeachers = sortedTeachers.slice(0, entriesPerPage);

  const chartData = useMemo(() => {
    const aktif = teachers.filter((t) => t.is_active).length;
    const nonAktif = teachers.length - aktif;
    return [
      { name: 'Aktif', value: aktif },
      { name: 'Tidak Aktif', value: nonAktif },
    ];
  }, [teachers]);

  const COLORS = ['#2563EB', '#EF4444'];

  const handleDelete = (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus data guru ini?')) {
      router.delete(route('teachers.destroy', id));
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title="Daftar Guru" />

      <div className="max-w-full overflow-hidden py-4 px-3 sm:px-4 font-comfortaa">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-800 text-center lg:text-left w-full lg:w-auto">
            Daftar Data Guru
          </h1>

          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label
                htmlFor="entries"
                className="text-gray-600 text-sm md:text-base whitespace-nowrap"
              >
                Tampilkan:
              </label>
              <select
                id="entries"
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                className="py-2 px-3 border border-gray-500 rounded-xl focus:ring-transparent focus:border-gray-500 text-sm w-full sm:w-auto"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={filteredTeachers.length}>Semua</option>
              </select>
            </div>

            <div className="relative w-full sm:w-64">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nama guru..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-500 rounded-xl focus:ring-transparent focus:border-gray-500 w-full"
              />
            </div>

            <Link
              href={route('teachers.create')}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl whitespace-nowrap w-full sm:w-auto text-center"
            >
              <FaPlus /> Tambah Guru
            </Link>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-4 mb-6 w-full">
          <h2 className="text-lg font-semibold text-gray-800 mb-3 text-center md:text-left">
            Statistik Guru
          </h2>
          <div className="w-full h-52 sm:h-72 md:h-80">
           <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius="50%"
                outerRadius="80%"
                paddingAngle={0}
                label={false} 
                stroke="none" 
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [value, 'Jumlah']}
                contentStyle={{
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                wrapperStyle={{ fontSize: '14px' }}
              />
            </PieChart>
          </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-2xl w-full overflow-hidden">
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse text-xs sm:text-sm md:text-base">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-2 sm:px-4 py-3 text-left font-semibold text-gray-700">No</th>
                  <th className="px-2 sm:px-4 py-3 text-left font-semibold text-gray-700">Nama</th>
                  <th className="px-2 sm:px-4 py-3 text-left font-semibold text-gray-700">NIP</th>
                  <th className="px-2 sm:px-4 py-3 text-left font-semibold text-gray-700">Email</th>
                  <th className="px-2 sm:px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                  <th className="px-2 sm:px-4 py-3 text-left font-semibold text-gray-700">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {displayedTeachers.length > 0 ? (
                  displayedTeachers.map((teacher, index) => (
                    <tr key={teacher.id} className="hover:bg-gray-50">
                      <td className="px-2 sm:px-4 py-3 text-center">{index + 1}</td>
                      <td className="px-2 sm:px-4 py-3 break-words">{teacher.nama_lengkap}</td>
                      <td className="px-2 sm:px-4 py-3 break-words">{teacher.nip}</td>
                      <td className="px-2 sm:px-4 py-3 break-all">{teacher.email}</td>
                      <td className="px-2 sm:px-4 py-3 text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-[10px] sm:text-xs md:text-sm font-semibold ${
                            teacher.is_active
                              ? 'bg-green-200 text-green-800'
                              : 'bg-red-200 text-red-800'
                          }`}
                        >
                          {teacher.is_active ? 'Aktif' : 'Tidak Aktif'}
                        </span>
                      </td>
                      <td className="px-2 sm:px-4 py-3">
                        <div className="flex justify-center sm:justify-start items-center gap-3">
                          <Link
                            href={route('teachers.show', teacher.id)}
                            className="text-blue-500 hover:text-blue-600 transition-transform transform hover:scale-110"
                          >
                            <i className="fa-solid fa-eye text-base sm:text-lg"></i>
                          </Link>
                          <Link
                            href={route('teachers.edit', teacher.id)}
                            className="text-yellow-500 hover:text-yellow-600 transition-transform transform hover:scale-110"
                          >
                            <i className="fa-solid fa-pen-to-square text-base sm:text-lg"></i>
                          </Link>
                          <button
                            onClick={() => handleDelete(teacher.id)}
                            className="text-red-500 hover:text-red-600 transition-transform transform hover:scale-110"
                          >
                            <i className="fa-solid fa-trash text-base sm:text-lg"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center p-6 text-gray-500">
                      Data guru tidak ada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 text-xs sm:text-sm text-gray-600 text-center md:text-left">
          Menampilkan {displayedTeachers.length === 0 ? 0 : 1} sampai{' '}
          {Math.min(entriesPerPage, sortedTeachers.length)} dari {sortedTeachers.length} data guru
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
