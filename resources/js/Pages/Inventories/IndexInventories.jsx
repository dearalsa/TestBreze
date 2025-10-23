import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { useState, useMemo } from 'react';

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

  const totalEntries = filteredInventories.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);

  const paginatedInventories = useMemo(() => {
    const startIndex = (currentPage - 1) * entriesPerPage;
    const endIndex = startIndex + entriesPerPage;
    return filteredInventories.slice(startIndex, endIndex);
  }, [filteredInventories, currentPage, entriesPerPage]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title="Daftar Barang" />
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Daftar Barang</h2>

          <div className="flex gap-2 w-full md:w-auto items-center">
            <div className="flex items-center gap-2">
              <label htmlFor="entries" className="text-gray-600 text-sm md:text-base whitespace-nowrap">
                Tampilkan:
              </label>
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
                <option value={totalEntries}>Semua</option>
              </select>
            </div>
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
                className="pl-10 pr-4 py-2 border border-gray-500 rounded-xl focus:ring-transparent focus:border-gray-500 w-64"
              />
            </div>

            <Link
              href={route('inventories.create')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl focus:outline-none focus:ring-0"
            >
              <FaPlus /> Tambah Barang
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto bg-white rounded-xl shadow-lg w-full">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 w-12 whitespace-nowrap">No</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 w-24 whitespace-nowrap">Kode</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 w-24 whitespace-nowrap">Nama</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 w-24 whitespace-nowrap">Kategori</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 w-24 whitespace-nowrap">Status</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 w-24 whitespace-nowrap">Lokasi</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 w-24 whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedInventories.length > 0 ? (
                paginatedInventories.map((item, index) => (
                  <tr key={item.id} className="border-t hover:bg-gray-50">
                    <td className="p-4 text-gray-700 font-medium">
                      {(currentPage - 1) * entriesPerPage + index + 1}
                    </td>
                    <td className="p-4">{item.kode_barang}</td>
                    <td className="p-4">{item.nama_barang}</td>
                    <td className="p-4">{item.kategori}</td>
                    <td className="p-4">{item.status}</td>
                    <td className="p-4">{item.lokasi_barang}</td>
                    <td className="px-4 py-2 text-center space-x-1 whitespace-nowrap">
                      <Link
                        href={route('inventories.show', item.id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium py-1 px-2 rounded transition duration-200"
                      >
                        Detail
                      </Link>

                      <Link
                        href={route('inventories.edit', item.id)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white text-xs font-medium py-1 px-2 rounded transition duration-200"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-500 hover:bg-red-600 text-white text-xs font-medium py-1 px-2 rounded transition duration-200"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center p-6 text-gray-500">
                    {searchTerm ? `Tidak ditemukan data barang untuk "${searchTerm}"` : 'Tidak ada data barang'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-4">
          {totalPages > 1 && (
            <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                  currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''
                }`}
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToPage(index + 1)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    currentPage === index + 1
                      ? 'z-10 bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
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
