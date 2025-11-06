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

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const renderPaginationButtons = () => {
    const maxButtons = 5;
    const buttons = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    if (totalPages > maxButtons && endPage === totalPages) startPage = Math.max(1, totalPages - maxButtons + 1);

    buttons.push(
      <button
        key="prev"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-2 border border-gray-300 bg-white text-sm font-plusmedium text-gray-600 hover:bg-gray-50 rounded-l-xl transition ${
          currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''
        }`}
      >
        &lt;
      </button>
    );

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`px-3 py-2 border-t border-b border-gray-300 text-sm font-plusmedium transition ${
            currentPage === i
              ? 'bg-blue-600 border-blue-600 text-white'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }

    buttons.push(
      <button
        key="next"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-2 border border-gray-300 bg-white text-sm font-plusmedium text-gray-600 hover:bg-gray-50 rounded-r-xl transition ${
          currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''
        }`}
      >
        &gt;
      </button>
    );

    return buttons;
  };

  return (
    <AuthenticatedLayout>
      <Head title="Daftar Kategori" />
      <div className="max-w-full overflow-hidden py-4 px-3 sm:px-6 font-plusmedium">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <h1 className="text-3xl font-plusmedium text-gray-800 text-center lg:text-left w-full lg:w-auto">
            Daftar Kategori
          </h1>

          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label htmlFor="entries" className="text-gray-600 text-sm md:text-base whitespace-nowrap font-plusregular">Tampilkan:</label>
              <select
                id="entries"
                value={entriesPerPage}
                onChange={(e) => { setEntriesPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="py-2 px-3 border border-gray-300 rounded-xl focus:ring-transparent focus:border-gray-400 text-sm w-full sm:w-auto font-plusregular"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={totalEntries}>Semua</option>
              </select>
            </div>

            <div className="relative w-full sm:w-64">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari kategori..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-transparent focus:border-gray-400 w-full font-plusregular"
              />
            </div>

            <Link
              href={route('categories.create')}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl whitespace-nowrap w-full sm:w-auto text-center font-plusmedium"
            >
              <FaPlus /> Tambah Kategori
            </Link>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-2xl w-full overflow-hidden">
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse text-xs sm:text-sm md:text-base">
              <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-3 w-[5%] text-center font-normal text-gray-700">No</th>
                <th className="px-3 py-3 w-[85%] text-left font-normal text-gray-700">Nama Kategori</th>
                <th className="px-3 py-3 w-[10%] text-center font-normal text-gray-700">Aksi</th>
              </tr>
            </thead>
              <tbody className="divide-y divide-gray-200 font-plusregular">
                {displayedCategories.length > 0 ? (
                  displayedCategories.map((category, index) => (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-center">{startIndex + index + 1}</td>
                      <td className="px-3 py-2">{category.category_name}</td>
                      <td className="px-3 py-2 text-center">
                        <div className="flex justify-center items-center gap-3">
                          <Link
                            href={route('categories.edit', category.id)}
                            className="text-yellow-500 hover:text-yellow-600 transition-transform transform hover:scale-110"
                          >
                            <FaPen className="text-base sm:text-lg" />
                          </Link>
                          <button
                            onClick={() => handleDelete(category.id)}
                            className="text-red-500 hover:text-red-600 transition-transform transform hover:scale-110"
                          >
                            <FaTrash className="text-base sm:text-lg" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center p-6 text-gray-500 font-plusregular">Tidak ada kategori</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 text-xs sm:text-sm text-gray-600 text-center md:text-left font-plusregular">
          Menampilkan {totalEntries === 0 ? 0 : startIndex + 1} sampai {Math.min(currentPage * entriesPerPage, totalEntries)} dari {totalEntries} kategori
        </div>

        {totalPages > 1 && (
          <div className="mt-2 flex justify-center md:justify-end">
            <nav className="inline-flex flex-wrap rounded-xl shadow-sm border border-gray-300 divide-x divide-gray-300" aria-label="Pagination">
              {renderPaginationButtons()}
            </nav>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
