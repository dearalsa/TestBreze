import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { useState, useMemo, useEffect } from 'react';

export default function IndexInventories() {
  const { inventories } = usePage().props;

  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const handleDelete = (id) => {
    if (confirm('Yakin ingin menghapus barang ini?')) {
      router.delete(route('inventories.destroy', id));
    }
  };

  const handleEntriesChange = (e) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const filteredInventories = useMemo(() => {
    return inventories.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [inventories, searchTerm]);

  const sortedInventories = useMemo(() => {
    return [...filteredInventories].sort((a, b) =>
      a.nama_barang.localeCompare(b.nama_barang, 'id', { sensitivity: 'base' })
    );
  }, [filteredInventories]);

  const totalEntries = sortedInventories.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);

  const paginatedInventories = useMemo(() => {
    const startIndex = (currentPage - 1) * entriesPerPage;
    const endIndex = startIndex + entriesPerPage;
    return sortedInventories.slice(startIndex, endIndex);
  }, [sortedInventories, currentPage, entriesPerPage]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  useEffect(() => {
    let buffer = '';
    let timer;

    const handleKeydown = (e) => {
      const tag = e.target.tagName.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;

      if (timer) clearTimeout(timer);

      if (e.key !== 'Enter') {
        buffer += e.key;
        timer = setTimeout(() => (buffer = ''), 100);
      } else {
        if (buffer.length > 2) {
          setSearchTerm(buffer);
          setCurrentPage(1);
        }
        buffer = '';
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, []);

  return (
    <AuthenticatedLayout>
      <Head title="Daftar Barang" />
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Daftar Barang</h2>

          <div className="flex flex-wrap gap-3 items-center justify-end">
            <div className="flex items-center gap-2">
              <label htmlFor="entries" className="text-gray-600 text-sm whitespace-nowrap">
                Tampilkan:
              </label>
              <select
                id="entries"
                value={entriesPerPage}
                onChange={handleEntriesChange}
                className="py-2 border border-gray-400 rounded-lg focus:ring-transparent focus:border-gray-600 text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={totalEntries}>Semua</option>
              </select>
            </div>

            {/* Fitur pencarian */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari Barang..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 pr-4 py-2 border border-gray-400 rounded-lg focus:ring-transparent focus:border-gray-600 text-sm w-56 md:w-64"
              />
            </div>

            {/* Tombol untuk tambah barang */}
            <Link
              href={route('inventories.create')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              <FaPlus /> Tambah Barang
            </Link>
          </div>
        </div>

        {/* Tabel */}
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg w-full">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-12">No</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Kode</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nama</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Kategori</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Lokasi</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-32">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedInventories.length > 0 ? (
                paginatedInventories.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-700">
                      {(currentPage - 1) * entriesPerPage + index + 1}
                    </td>
                    <td className="px-4 py-3">{item.kode_barang}</td>
                    <td className="px-4 py-3">{item.nama_barang}</td>
                    <td className="px-4 py-3">{item.kategori}</td>
                    <td className="px-4 py-3">{item.status}</td>
                    <td className="px-4 py-3">{item.lokasi_barang}</td>
                    <td className="px-4 py-3 text-left">
                      <div className="flex justify-start items-center gap-3">
                        <Link
                          href={route('inventories.show', item.id)}
                          className="text-blue-500 hover:text-blue-600 transition-transform transform hover:scale-110"
                        >
                          <i className="fa-solid fa-eye text-lg"></i>
                        </Link>
                        <Link
                          href={route('inventories.edit', item.id)}
                          className="text-yellow-500 hover:text-yellow-600 transition-transform transform hover:scale-110"
                        >
                          <i className="fa-solid fa-pen-to-square text-lg"></i>
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-500 hover:text-red-600 transition-transform transform hover:scale-110"
                        >
                          <i className="fa-solid fa-trash text-lg"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center p-6 text-gray-500">
                    {searchTerm
                      ? `Tidak ditemukan data barang untuk "${searchTerm}"`
                      : 'Tidak ada data barang'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Info Pagination */}
        <div className="mt-3 text-sm text-gray-600">
          Menampilkan {totalEntries === 0 ? 0 : (currentPage - 1) * entriesPerPage + 1} sampai{' '}
          {Math.min(currentPage * entriesPerPage, totalEntries)} dari {totalEntries} data barang
        </div>

        {/* Pagination */}
        <div className="flex justify-end mt-4">
          {totalPages > 1 && (
            <nav className="inline-flex rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-l-md ${
                  currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''
                }`}
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToPage(index + 1)}
                  className={`px-4 py-2 border text-sm font-medium ${
                    currentPage === index + 1
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-r-md ${
                  currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''
                }`}
              >
                Next
              </button>
            </nav>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}