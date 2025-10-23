import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { FaSearch } from 'react-icons/fa';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function Index() {
  const { students, flash } = usePage().props;
  const [search, setSearch] = useState('');
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const handleDelete = (id) => {
    if (confirm('Yakin ingin menghapus data siswa ini?')) {
      router.delete(route('students.destroy', id));
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleEntriesChange = (e) => {
    setEntries(parseInt(e.target.value));
    setCurrentPage(1);
  };

  // 🔍 Filter pencarian
  const filteredStudents = students.filter(
    (s) =>
      s.nama_lengkap.toLowerCase().includes(search.toLowerCase()) ||
      s.nisn.toLowerCase().includes(search.toLowerCase()) ||
      s.jurusan.toLowerCase().includes(search.toLowerCase()) ||
      s.angkatan.toLowerCase().includes(search.toLowerCase())
  );

  // 🔤 Sorting nama dari A–Z
  const sortedStudents = [...filteredStudents].sort((a, b) =>
    a.nama_lengkap.localeCompare(b.nama_lengkap, 'id', { sensitivity: 'base' })
  );

  const indexOfLast = currentPage * entries;
  const indexOfFirst = indexOfLast - entries;
  const currentStudents = sortedStudents.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedStudents.length / entries);

  // Chart data
  const total = students.length;
  const jurusanLabels = ['PPLG', 'Animasi', 'BCF', 'TPFL', 'TO'];
  const jurusanCounts = jurusanLabels.map((j) => students.filter((s) => s.jurusan === j).length);

  const laki = students.filter((s) => s.jenis_kelamin === 'Laki-laki').length;
  const perempuan = students.filter((s) => s.jenis_kelamin === 'Perempuan').length;

  // Hitung jumlah siswa aktif dan tidak aktif
  const aktif = students.filter((s) => s.is_active === '1').length;
  const tidakAktif = students.filter((s) => s.is_active !== '1').length;

  const pieData = {
    labels: ['Laki-laki', 'Perempuan'],
    datasets: [
      {
        data: [laki, perempuan],
        backgroundColor: ['#3b82f6', '#ec4899'],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#374151', font: { family: 'Comfortaa', size: 14, weight: '500' } },
      },
      title: {
        display: true,
        text: 'Distribusi Jenis Kelamin',
        color: '#1f2937',
        font: { family: 'Comfortaa', size: 16, weight: '600' },
      },
      tooltip: {
        bodyFont: { family: 'Comfortaa', size: 14 },
        titleFont: { family: 'Comfortaa', size: 14, weight: '600' },
      },
    },
  };

  // 🔁 Bar chart diganti dari per jurusan menjadi aktif vs tidak aktif
  const barData = {
    labels: ['Aktif', 'Tidak Aktif'],
    datasets: [
      {
        label: 'Jumlah Siswa',
        data: [aktif, tidakAktif],
        backgroundColor: ['#16a34a', '#dc2626'],
        borderRadius: 6,
        barPercentage: 0.5,
      },
    ],
  };

  const barOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Status Keaktifan Siswa',
        color: '#1f2937',
        font: { family: 'Comfortaa', size: 16, weight: '600' },
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#4b5563',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 10,
        bodyFont: { family: 'Comfortaa', size: 14 },
        titleFont: { family: 'Comfortaa', size: 14, weight: '600' },
      },
    },
    scales: {
      x: {
        grid: { color: '#e5e7eb' },
        ticks: { color: '#4b5563', beginAtZero: true, stepSize: 1, font: { family: 'Comfortaa', size: 14 } },
      },
      y: {
        grid: { display: false },
        ticks: { color: '#4b5563', font: { family: 'Comfortaa', size: 14 }, padding: 15 },
      },
    },
  };

  return (
    <AuthenticatedLayout>
      <Head title="Data Siswa" />
      <div className="w-full flex-1 overflow-auto pl-2 pr-8 sm:pl-4 sm:pr-8 py-4 font-comfortaa">
        {flash.success && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded shadow">{flash.success}</div>
        )}

        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">Daftar Data Siswa</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6 w-full">
          <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-4 rounded-xl shadow-lg col-span-2 sm:col-span-1">
            <p className="text-sm opacity-80">Total Siswa</p>
            <p className="text-xl sm:text-2xl font-bold">{total}</p>
          </div>
          {jurusanLabels.map((j, i) => (
            <div
              key={i}
              className="bg-gradient-to-r from-purple-400 to-purple-600 text-white p-4 rounded-xl shadow-lg"
            >
              <p className="text-sm opacity-80">{j}</p>
              <p className="text-xl sm:text-2xl font-bold">{jurusanCounts[i]}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 w-full">
          <div className="bg-white p-4 rounded-xl shadow-lg w-full h-[300px] md:h-[400px]">
            <Pie data={pieData} options={pieOptions} />
          </div>
          <div className="bg-white p-4 rounded-xl shadow-lg w-full h-[300px] md:h-[400px]">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4 w-full">
          <div className="flex items-center w-full md:w-auto md:max-w-xs h-10 border border-gray-300 rounded overflow-hidden">
            <FaSearch className="bg-blue-600 text-white p-2 h-11 w-9 flex items-center justify-center rounded-l" />
            <input
              type="text"
              placeholder="Cari siswa..."
              value={search}
              onChange={handleSearchChange}
              className="py-2 px-3 w-full md:w-72 focus:outline-none focus:ring-0 h-full text-gray-700 border-none"
            />
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto justify-between flex-wrap">
            <label className="flex items-center gap-2 text-gray-700 whitespace-nowrap">
              Tampilkan:
              <select
                value={entries}
                onChange={handleEntriesChange}
                className="ml-1 border border-gray-300 rounded py-2 px-3 focus:outline-none h-10 bg-white appearance-none"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={filteredStudents.length}>Semua</option>
              </select>
            </label>
            <Link
              href={route('students.create')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl focus:outline-none focus:ring-0"
            >
              + Tambah Data
            </Link>
          </div>
        </div>

        {/* Tabel siswa */}
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg w-full">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 w-10">No</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 w-24 whitespace-nowrap">NISN</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 whitespace-nowrap">Nama Lengkap</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 w-28 whitespace-nowrap">Jurusan</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 w-20 whitespace-nowrap">Angkatan</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 w-28 whitespace-nowrap">Jenis Kelamin</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 w-24 whitespace-nowrap">Status</th>
                <th className="px-4 py-2 text-center text-sm font-medium text-gray-700 w-40 whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentStudents.length > 0 ? (
                currentStudents.map((s, i) => (
                  <tr key={s.id} className="hover:bg-gray-50 transition duration-150">
                    <td className="px-4 py-2 text-sm text-gray-700 whitespace-nowrap">{indexOfFirst + i + 1}</td>
                    <td className="px-4 py-2 text-sm text-gray-700 whitespace-nowrap">{s.nisn}</td>
                    <td className="px-4 py-2 text-sm text-gray-700 whitespace-nowrap">{s.nama_lengkap}</td>
                    <td className="px-4 py-2 text-sm text-gray-700 whitespace-nowrap">{s.jurusan}</td>
                    <td className="px-4 py-2 text-sm text-gray-700 whitespace-nowrap">{s.angkatan}</td>
                    <td className="px-4 py-2 text-sm text-gray-700 whitespace-nowrap">{s.jenis_kelamin}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {s.is_active === '1' ? (
                        <span className="inline-block bg-green-200 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                          Aktif
                        </span>
                      ) : (
                        <span className="inline-block bg-red-200 text-red-800 text-xs font-semibold px-2 py-1 rounded-full">
                          Tidak Aktif
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-center space-x-1 whitespace-nowrap">
                      <Link
                        href={route('students.show', s.id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium py-1 px-2 rounded transition duration-200"
                      >
                        Detail
                      </Link>
                      <Link
                        href={route('students.edit', s.id)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white text-xs font-medium py-1 px-2 rounded transition duration-200"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="bg-red-500 hover:bg-red-600 text-white text-xs font-medium py-1 px-2 rounded transition duration-200"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-4 py-6 text-center text-gray-500">
                    Data siswa tidak ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Info jumlah data ditampilkan */}
        <div className="mt-3 text-sm text-gray-600">
          Menampilkan {filteredStudents.length === 0 ? 0 : indexOfFirst + 1} sampai{' '}
          {Math.min(indexOfLast, filteredStudents.length)} dari {filteredStudents.length} data siswa
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center md:justify-end items-center mt-4 gap-2 flex-wrap">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } transition duration-150`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
