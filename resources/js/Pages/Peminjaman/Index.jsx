import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { FaEye, FaRotateRight } from 'react-icons/fa6';
import { useState, useMemo, useEffect } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/id';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('id');
dayjs.tz.setDefault('Asia/Jakarta');

export default function IndexPeminjaman() {
  const { peminjamen, flash } = usePage().props; 
  const [search, setSearch] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    const dataArray = peminjamen || []; 
    return dataArray.filter((p) => {
      const searchString = [
        p?.peminjam_id,
        p?.role,
        p?.barang_id,
        p?.status,
        p?.tanggal_peminjam,
        p?.tanggal_kembali,
        p?.tanggal_pengembalian,
      ].join(' ').toLowerCase();
      return searchString.includes(search.toLowerCase());
    });
  }, [peminjamen, search]);

  const sorted = filtered;
  const total = sorted.length;
  const totalPages = Math.ceil(total / entriesPerPage);
  const start = (currentPage - 1) * entriesPerPage;
  const paginated = sorted.slice(start, start + entriesPerPage);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleEntriesChange = (e) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleKembalikan = (id) => {
    if (confirm('Apakah Anda yakin ingin mengembalikan barang ini?')) {
      router.patch(route('peminjaman.kembalikan', id), {
        status: 'dikembalikan',
        tanggal_pengembalian: dayjs().toISOString(),
      }, {
        onSuccess: () => {
          router.reload({ preserveScroll: true });
        },
        onError: (errors) => {
          console.error('Gagal mengembalikan:', errors);
          alert('Gagal mengembalikan barang. Cek console log.');
        },
      });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'dipinjam':
        return <span className="px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-yellow-100 text-yellow-800">Dipinjam</span>;
      case 'dikembalikan':
        return <span className="px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-green-100 text-green-800">Dikembalikan</span>;
      case 'expired':
        return <span className="px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-red-100 text-red-800">Expired</span>;
      default:
        return <span className="px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const renderPaginationButtons = () => {
    const maxButtons = 5;
    const buttons = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (totalPages > maxButtons && endPage === totalPages) {
      startPage = Math.max(1, totalPages - maxButtons + 1);
    }

    buttons.push(
      <button
        key="prev"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-2 border border-gray-300 bg-white text-sm font-plusregular text-gray-600 hover:bg-gray-50 rounded-l-xl transition ${currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''}`}
      >
        &lt;
      </button>
    );

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`px-3 py-2 border-t border-b border-gray-300 text-sm font-plusregular transition ${currentPage === i ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
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
        className={`px-3 py-2 border border-gray-300 bg-white text-sm font-plusregular text-gray-600 hover:bg-gray-50 rounded-r-xl transition ${currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''}`}
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
          setSearch(buffer);
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
      <Head title="Daftar Peminjaman" />
      <div className="max-w-full overflow-hidden py-4 px-3 sm:px-6 font-plusregular">
        {flash && (
          <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-800 font-plusregular">
            {flash}
          </div>
        )}

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <h1 className="text-3xl font-plusregular text-gray-800">Data Peminjaman</h1>

          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label htmlFor="entries" className="text-gray-600 text-sm md:text-base whitespace-nowrap font-plusregular">
                Tampilkan:
              </label>

              <select
                id="entries"
                value={entriesPerPage}
                onChange={handleEntriesChange}
                className="py-2 px-3 border border-gray-500 rounded-xl text-sm w-full sm:w-auto font-plusregular"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={total}>Semua</option>
              </select>
            </div>

            <div className="relative w-full sm:w-64">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari Peminjaman..."
                value={search}
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-2 border border-gray-500 rounded-xl w-full font-plusregular"
              />
            </div>

            <Link
              href={route('peminjaman.create')}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl whitespace-nowrap w-full sm:w-auto font-plusregular"
            >
              <FaPlus /> Tambah
            </Link>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-2xl w-full overflow-hidden">
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse text-xs sm:text-sm md:text-base">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-3 w-[5%] text-center text-gray-700 font-medium">No</th>
                  <th className="px-3 py-3 w-[15%] text-left text-gray-700 font-medium">ID Peminjam</th>
                  <th className="px-3 py-3 w-[15%] text-left text-gray-700 font-medium">Role</th>
                  <th className="px-3 py-3 w-[15%] text-left text-gray-700 font-medium">ID Barang</th>
                  <th className="px-3 py-3 w-[25%] text-left text-gray-700 whitespace-nowrap font-medium">Tanggal Pinjam</th>
                  <th className="px-3 py-3 w-[25%] text-left text-gray-700 whitespace-nowrap font-medium">Tanggal Kembali</th>
                  <th className="px-3 py-3 w-[10%] text-center text-gray-700 font-medium">Status</th>
                  <th className="px-3 py-3 w-[25%] text-left text-gray-700 whitespace-nowrap font-medium">Kembali</th>
                  <th className="px-3 py-3 w-[10%] text-center text-gray-700 font-medium">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 font-plusregular">
                {paginated.length > 0 ? (
                  paginated.map((p, i) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-center">{start + i + 1}</td>
                      <td className="px-4 py-4 break-words">{p.peminjam_id}</td>
                      <td className="px-4 py-4 break-words">{p.role}</td>
                      <td className="px-4 py-4 break-words">{p.barang_id}</td>
                      <td className="px-4 py-4 whitespace-nowrap">{dayjs.utc(p.tanggal_peminjam).tz('Asia/Jakarta').format('DD MMM YYYY HH:mm')}</td>
                      <td className="px-4 py-4 whitespace-nowrap">{dayjs.utc(p.tanggal_kembali).tz('Asia/Jakarta').format('DD MMM YYYY HH:mm')}</td>
                      <td className="px-4 py-4">{getStatusBadge(p.status)}</td>
                      <td className="px-4 py-4 whitespace-nowrap">{p.tanggal_pengembalian ? dayjs.utc(p.tanggal_pengembalian).tz('Asia/Jakarta').format('DD MMM YYYY HH:mm') : '-'}</td>
                      <td className="px-3 py-3 text-center">
                        <div className="flex justify-center items-center gap-3">
                          <Link href={route('peminjaman.show', p.id)} className="text-blue-500 hover:text-blue-600 transition-transform transform hover:scale-110" title="Lihat Detail">
                            <FaEye />
                          </Link>
                          {(p.status === 'dipinjam' || p.status === 'expired') && (
                            <button onClick={() => handleKembalikan(p.id)} className="text-green-500 hover:text-green-600 transition-transform transform hover:scale-110 ml-2" title="Kembalikan Barang">
                              <FaRotateRight />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center p-6 text-gray-500">Data peminjaman tidak ada.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 text-xs sm:text-sm text-gray-600">
          Menampilkan {total === 0 ? 0 : start + 1} sampai {Math.min(start + entriesPerPage, total)} dari {total} data peminjaman
        </div>

        {totalPages > 1 && (
          <div className="mt-2 flex justify-center md:justify-end">
            <nav className="inline-flex flex-wrap rounded-xl shadow-sm border border-gray-300 divide-x divide-gray-300">
              {renderPaginationButtons()}
            </nav>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
