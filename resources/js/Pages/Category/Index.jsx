import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { FaPlus, FaSearch, FaPen, FaTrash } from 'react-icons/fa';

export default function Index() {
  const { categories = [] } = usePage().props;

  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const handleDelete = (id) => {
    if (confirm('Yakin ingin menghapus kategori ini?')) {
      router.delete(route('categories.destroy', id));
    }
  };

  const filteredCategories = useMemo(() => {
    return categories
      .filter((category) =>
        category.category_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) =>
        a.category_name.localeCompare(b.category_name, 'id', { sensitivity: 'base' })
      );
  }, [categories, searchTerm]);

  const totalEntries = filteredCategories.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const displayedCategories = filteredCategories.slice(
    startIndex,
    startIndex + entriesPerPage
  );

  return (
    <AuthenticatedLayout>
      <Head title="Daftar Kategori" />

      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">
          <h2 className="text-3xl font-bold text-gray-800">Daftar Kategori</h2>
          <div className="flex flex-wrap items-center gap-3">
            {/* Entries per page */}
            <div className="flex items-center gap-2">
              <label
                htmlFor="entries"
                className="text-gray-600 text-sm md:text-base whitespace-nowrap"
              >
                Tampilkan:
              </label>
              <select
                id="entries"
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="py-2 border border-gray-500 rounded-xl focus:ring-transparent focus:border-gray-500 text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={totalEntries}>Semua</option>
              </select>
            </div>

            {/* Search bar */}
            <div className="relative w-64">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari kategori..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-400 rounded-lg focus:ring-transparent focus:border-gray-600 text-sm w-56 md:w-64"
              />
            </div>

            {/* Tambah kategori */}
            <Link
              href={route('categories.create')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2"
            >
              <FaPlus /> Tambah Kategori
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow-md rounded-2xl p-4">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="p-3 w-16">No</th>
                <th className="p-3">Nama Kategori</th>
                <th className="p-3 text-right w-32">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {displayedCategories.length > 0 ? (
                displayedCategories.map((category, index) => (
                  <tr key={category.id} className="border-b hover:bg-gray-50 transition">
                    <td className="p-3">{startIndex + index + 1}</td>
                    <td className="p-3">{category.category_name}</td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-3">
                        <Link
                          href={route('categories.edit', category.id)}
                          className="text-yellow-500 hover:text-yellow-600 transition-transform transform hover:scale-110"
                        >
                          <FaPen className="text-lg" />
                        </Link>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="text-red-500 hover:text-red-600 transition-transform transform hover:scale-110"
                        >
                          <FaTrash className="text-lg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-3 text-center text-gray-500">
                    {searchTerm
                      ? `Tidak ditemukan kategori untuk "${searchTerm}"`
                      : 'Tidak ada kategori ditemukan.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
              <p>
                Menampilkan {startIndex + 1} -{' '}
                {Math.min(startIndex + entriesPerPage, totalEntries)} dari {totalEntries} entri
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded-xl disabled:opacity-50"
                >
                  Sebelumnya
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded-xl disabled:opacity-50"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
