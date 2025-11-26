import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { FaSearch, FaFilePdf, FaFileExcel } from 'react-icons/fa';
import { useState, useMemo } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/id';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('id');
dayjs.tz.setDefault('Asia/Jakarta');

export default function IndexLaporan() {
    const { laporan } = usePage().props;

    const [tanggalAwal, setTanggalAwal] = useState('');
    const [tanggalAkhir, setTanggalAkhir] = useState('');
    const [status, setStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const entriesPerPage = 10;

    const filtered = useMemo(() => {
        return laporan.filter((item) => {
            const tgl = dayjs(item.tanggal_peminjam);

            const matchTanggal =
                (!tanggalAwal || tgl.isAfter(dayjs(tanggalAwal).subtract(1, 'day'))) &&
                (!tanggalAkhir || tgl.isBefore(dayjs(tanggalAkhir).add(1, 'day')));

            const matchStatus =
                status === '' || item.status === status;

            return matchTanggal && matchStatus;
        });
    }, [laporan, tanggalAwal, tanggalAkhir, status]);

    const totalPages = Math.ceil(filtered.length / entriesPerPage);
    const start = (currentPage - 1) * entriesPerPage;
    const paginated = filtered.slice(start, start + entriesPerPage);

    const handleCari = () => {
        setCurrentPage(1);
    };

    const downloadPDF = () => {
        const params = new URLSearchParams({
            tanggal_awal: tanggalAwal,
            tanggal_akhir: tanggalAkhir,
            status: status
        }).toString();
        
        window.location.href = route('laporan.exportPDF') + (params ? `?${params}` : '');
    };

    const downloadExcel = () => {
        const params = new URLSearchParams({
            tanggal_awal: tanggalAwal,
            tanggal_akhir: tanggalAkhir,
            status: status
        }).toString();
        window.location.href = route('laporan.exportExcel') + (params ? `?${params}` : '');
    };

    return (
        <AuthenticatedLayout>
            <Head title="Laporan Peminjaman" />

            <div className="max-w-full py-4 px-4 sm:px-6 font-plusregular">
                <h1 className="text-3xl font-plusregular text-gray-800 mb-6">Laporan Peminjaman</h1>

                <div className="bg-white p-4 rounded-xl shadow mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="text-sm text-gray-600">Tanggal Awal</label>
                            <input
                                type="date"
                                className="w-full mt-1 border rounded-lg p-2 focus:outline-none focus:ring-0 focus:border-current"
                                value={tanggalAwal}
                                onChange={(e) => setTanggalAwal(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-600">Tanggal Akhir</label>
                            <input
                                type="date"
                                className="w-full mt-1 border rounded-lg p-2 focus:outline-none focus:ring-0 focus:border-current"
                                value={tanggalAkhir}
                                onChange={(e) => setTanggalAkhir(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-600">Status</label>
                            <select
                                className="w-full mt-1 border rounded-lg p-2 focus:outline-none focus:ring-0 focus:border-current"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="">Semua</option>
                                <option value="dipinjam">Dipinjam</option>
                                <option value="dikembalikan">Dikembalikan</option>
                                <option value="expired">Expired</option>
                            </select>
                        </div>

                        <div className="flex items-end">
                            <button
                                onClick={handleCari}
                                className="bg-blue-600 text-white w-full py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                            >
                                <FaSearch /> Cari
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-4">
                        <button
                            onClick={downloadPDF}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700"
                        >
                            <FaFilePdf /> PDF
                        </button>

                        <button
                            onClick={downloadExcel}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
                        >
                            <FaFileExcel /> Excel
                        </button>
                    </div>
                </div>

                <div className="bg-white shadow-lg rounded-xl w-full overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-3 py-3 w-[5%] text-center text-gray-900 font-medium">No</th>
                                <th className="px-3 py-3 w-[12%] text-left text-gray-900 font-medium">ID Peminjam</th>
                                <th className="px-3 py-3 w-[10%] text-left text-gray-900 font-medium">Role</th>
                                <th className="px-3 py-3 w-[12%] text-left text-gray-900 font-medium">ID Barang</th>
                                <th className="px-3 py-3 w-[15%] text-left text-gray-900 whitespace-nowrap font-medium">Tanggal Pinjam</th>
                                <th className="px-3 py-3 w-[15%] text-left text-gray-900 whitespace-nowrap font-medium">Tanggal Kembali</th>
                                <th className="px-3 py-3 w-[15%] text-left text-gray-900 whitespace-nowrap font-medium">Tanggal Pengembalian</th>
                                <th className="px-3 py-3 w-[11%] text-left text-gray-900 font-medium">Status</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {paginated.length > 0 ? (
                                paginated.map((p, i) => (
                                    <tr key={p.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-center">{start + i + 1}</td>
                                        <td className="px-4 py-3">{p.peminjam_id}</td>
                                        <td className="px-4 py-3 capitalize">{p.role || '-'}</td>
                                        <td className="px-4 py-3">{p.barang_id}</td>
                                        <td className="px-4 py-3">
                                            {dayjs(p.tanggal_peminjam).format("DD MMM YYYY")}
                                        </td>
                                        <td className="px-4 py-3">
                                            {dayjs(p.tanggal_kembali).format("DD MMM YYYY")}
                                        </td>
                                        <td className="px-4 py-3">
                                            {p.tanggal_pengembalian ? dayjs(p.tanggal_pengembalian).format("DD MMM YYYY") : '-'}
                                        </td>
                                        <td className="px-4 py-3 capitalize">{p.status}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center p-5 text-gray-500">
                                        Tidak ada data laporan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="mt-4 flex justify-center gap-2">
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`px-3 py-1 border rounded-lg ${
                                    currentPage === i + 1
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white'
                                }`}
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