import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { useState, useMemo, useEffect } from 'react';

const StatCard = ({ title, value, color }) => (
  <div
    className="p-4 md:p-6 bg-white rounded-xl shadow-lg flex flex-col transition duration-300 hover:shadow-xl border-b-4 font-plusmedium"
    style={{ borderBottomColor: color }}
  >
    <p className="text-sm font-plusmedium text-gray-500 truncate">{title}</p>
    <p className="mt-1 text-3xl font-plusregular" style={{ color }}>{value}</p>
  </div>
);

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

  const totalInventories = inventories.length;

  const stats = useMemo(() => {
    const dipinjam = inventories.filter((item) => item.status === 'Dipinjam').length;
    const rusak = inventories.filter((item) => item.status === 'Rusak').length;
    const tersedia = totalInventories - dipinjam - rusak;
    const baru = inventories.filter((item) => item.status === 'Baru' || !item.status).length;
    const mainColor = '#1B3C53';
    return [
      { title: 'Total Barang', value: totalInventories, color: mainColor },
      { title: 'Tersedia', value: Math.max(tersedia, 0), color: mainColor },
      { title: 'Dipinjam', value: dipinjam, color: mainColor },
      { title: 'Rusak', value: rusak, color: mainColor },
      { title: 'Baru', value: baru, color: mainColor },
    ];
  }, [inventories, totalInventories]);

  const filteredInventories = useMemo(() => {
    return inventories.filter((item) => {
      const categoryName = item.category?.category_name || '';
      return Object.values({
        ...item,
        category_name: categoryName,
      }).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
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

  useEffect(() => {
    let buffer = '';
    let timer;
    const handleKeydown = (e) => {
      const tag = e.target.tagName.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;
      if (timer) clearTimeout(timer);
      if (e.key !== 'Enter') {
        if (e.key.length === 1 && /^[a-zA-Z0-9\-_]$/.test(e.key)) buffer += e.key;
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
      <div className="max-w-full overflow-hidden py-4 px-3 sm:px-6 font-plusmedium">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <h1 className="text-3xl font-plusmedium text-gray-800 text-center lg:text-left w-full lg:w-auto">
            Daftar Data Barang
          </h1>

          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label htmlFor="entries" className="text-gray-600 text-sm md:text-base whitespace-nowrap">Tampilkan:</label>
              <select
                id="entries"
                value={entriesPerPage}
                onChange={(e) => { setEntriesPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="py-2 px-3 border border-gray-500 rounded-xl focus:ring-transparent focus:border-gray-500 text-sm w-full sm:w-auto"
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
                placeholder="Cari Barang..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="pl-10 pr-4 py-2 border border-gray-500 rounded-xl focus:ring-transparent focus:border-gray-500 w-full"
              />
            </div>

            <Link
              href={route('inventories.create')}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl whitespace-nowrap w-full sm:w-auto text-center font-plusmedium"
            >
              <FaPlus /> Tambah Barang
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-6">
          {stats.map((stat, index) => <StatCard key={index} {...stat} />)}
        </div>

        <div className="bg-white shadow-lg rounded-2xl w-full overflow-hidden">
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse text-xs sm:text-sm md:text-base">
              <thead className="bg-gray-100 font-plusmedium">
                <tr>
                  <th className="px-3 py-3 w-[5%] text-center font-medium text-gray-700">No</th>
                  <th className="px-3 py-3 w-[15%] text-left font-medium text-gray-700">Kode</th>
                  <th className="px-3 py-3 w-[30%] text-left font-medium text-gray-700">Nama</th>
                  <th className="px-3 py-3 w-[20%] text-left font-medium text-gray-700 hidden sm:table-cell">Kategori</th>
                  <th className="px-3 py-3 w-[10%] text-center font-medium text-gray-700 hidden md:table-cell">Status</th>
                  <th className="px-3 py-3 w-[20%] text-left font-medium text-gray-700 hidden lg:table-cell">Lokasi</th>
                  <th className="px-3 py-3 w-[10%] text-center font-medium text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 font-plusregular">
              {paginatedInventories.length > 0 ? (
                paginatedInventories.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-3 py-3 text-center">{(currentPage - 1) * entriesPerPage + index + 1}</td>
                    <td className="px-3 py-3 break-words">{item.kode_barang}</td>
                    <td className="px-3 py-3 break-words">{item.nama_barang}</td>
                    <td className="px-3 py-3 break-words hidden sm:table-cell">
                      {item.category ? (
                        <span className="bg-gray-200 text-gray-800 text-xs px-2.5 py-0.5 rounded-full">{item.category.category_name}</span>
                      ) : (
                        <span className="text-gray-400 italic text-xs">-</span>
                      )}
                    </td>
                    <td className="px-3 py-3 break-words text-center hidden md:table-cell">
                      <span className={`px-2 py-1 rounded-full text-xs ${item.status === 'Tersedia' ? 'bg-green-100 text-green-800' : item.status === 'Dipinjam' ? 'bg-yellow-100 text-yellow-800' : item.status === 'Rusak' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 break-words hidden lg:table-cell">{item.lokasi_barang}</td>
                    <td className="px-3 py-3 text-center">
                      <div className="flex justify-center items-center gap-3">
                        <Link href={route('inventories.show', item.id)} className="text-blue-500 hover:text-blue-600 transition-transform transform hover:scale-110"><i className="fa-solid fa-eye text-base sm:text-lg"></i></Link>
                        <Link href={route('inventories.edit', item.id)} className="text-yellow-500 hover:text-yellow-600 transition-transform transform hover:scale-110"><i className="fa-solid fa-pen-to-square text-base sm:text-lg"></i></Link>
                        <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-600 transition-transform transform hover:scale-110"><i className="fa-solid fa-trash text-base sm:text-lg"></i></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center p-6 text-gray-500">Tidak ada data barang</td>
                </tr>
              )}
            </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 text-xs sm:text-sm text-gray-600 text-center md:text-left">
          Menampilkan {totalEntries === 0 ? 0 : (currentPage - 1) * entriesPerPage + 1} sampai {Math.min(currentPage * entriesPerPage, totalEntries)} dari {totalEntries} data barang
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