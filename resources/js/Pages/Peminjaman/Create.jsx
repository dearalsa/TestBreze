import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import { FaArrowLeft, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import id from 'date-fns/locale/id';

registerLocale('id', id);

export default function CreatePeminjaman() {
    const { auth } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        peminjam_id: '',
        role: '',
        barang_id: '',
        tanggal_peminjam: null,
        tanggal_kembali: null,
        keterangan: '',
        added_by: auth.user.id
    });

    const [notification, setNotification] = useState({ message: '', type: '' });

    const inputClass = 'w-full border border-gray-300 rounded-xl p-3 bg-gray-50 text-base focus:outline-none focus:ring-0 focus:border-gray-300 focus:bg-gray-50 active:bg-gray-50 font-plusregular';
    const checkButtonClass = 'px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 font-plusmedium rounded-xl transition duration-150 ease-in-out';

    const formatDateToMySQL = (date) => {
        if (!date) return null;
        const d = new Date(date);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const hh = String(d.getHours()).padStart(2, '0');
        const mi = String(d.getMinutes()).padStart(2, '0');
        const ss = '00';
        return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
    };

    function submit(e) {
        e.preventDefault();
        post(route('peminjaman.store'), {
            data: {
                ...data,
                tanggal_peminjam: formatDateToMySQL(data.tanggal_peminjam),
                tanggal_kembali: formatDateToMySQL(data.tanggal_kembali)
            }
        });
    }

    const showNotification = (message, type = 'info') => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: '', type: '' }), 3000);
    };

    const handleCheckPeminjamId = async () => {
        if (!data.role) return showNotification('Pilih jenis peminjam terlebih dahulu.', 'warning');
        if (!data.peminjam_id) return showNotification('Masukkan ID Peminjam terlebih dahulu.', 'warning');
        try {
            const res = await axios.get(route('peminjaman.checkPeminjam', { role: data.role, id: data.peminjam_id }));
            if (res.data.status) showNotification(`${res.data.message}: ${res.data.data.nama_lengkap}`, 'success');
            else showNotification(res.data.message, 'warning');
        } catch {
            showNotification('Terjadi kesalahan saat memeriksa ID.', 'warning');
        }
    };

    const handleCheckBarangId = async () => {
        if (!data.barang_id) return showNotification('Masukkan ID Barang terlebih dahulu.', 'warning');
        try {
            const res = await axios.get(route('peminjaman.checkBarang', { id: data.barang_id }));
            if (res.data.status) showNotification(`${res.data.message}: ${res.data.data.nama_barang}`, 'success');
            else showNotification(res.data.message, 'warning');
        } catch {
            showNotification('Terjadi kesalahan saat memeriksa Barang.', 'warning');
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Tambah Peminjaman" />
            <div className="max-w-4xl mx-auto p-6 font-plusregular">
                <Link href={route('peminjaman.index')} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 font-plusmedium">
                    <FaArrowLeft /> Kembali ke Daftar Peminjaman
                </Link>

                <h2 className="text-3xl text-gray-800 mb-6 font-plusmedium">Data Peminjaman</h2>

                {notification.message && (
                    <div className={`p-4 mb-6 rounded-xl flex items-center gap-3 ${
                        notification.type === 'warning'
                            ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                            : 'bg-green-100 text-green-700 border border-green-300'
                    } font-plusregular`}>
                        {notification.type === 'warning' ? (
                            <FaExclamationTriangle className="w-5 h-5" />
                        ) : (
                            <FaCheckCircle className="w-5 h-5" />
                        )}
                        <p className="font-plusmedium">{notification.message}</p>
                    </div>
                )}

                <form onSubmit={submit} className="bg-white shadow-md rounded-2xl p-6 space-y-6 font-plusregular">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700 mb-1 font-plusmedium">Jenis Peminjam</label>
                            <select value={data.role} onChange={(e) => setData('role', e.target.value)} className={inputClass}>
                                <option value="">Pilih</option>
                                <option value="Siswa">Siswa</option>
                                <option value="Guru">Guru</option>
                            </select>
                            {errors.role && <p className="text-red-500 text-sm mt-1 font-plusregular">{errors.role}</p>}
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-1 font-plusmedium">ID Peminjam</label>
                            <div className="flex gap-2 items-center">
                                <input
                                    type="text"
                                    value={data.peminjam_id}
                                    placeholder="Masukkan NISN/NIP"
                                    onChange={(e) => setData('peminjam_id', e.target.value)}
                                    className={inputClass + ' flex-1'}
                                />
                                <button type="button" onClick={handleCheckPeminjamId} className={checkButtonClass}>Cek ID</button>
                            </div>
                            {errors.peminjam_id && <p className="text-red-500 text-sm mt-1 font-plusregular">{errors.peminjam_id}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-gray-700 mb-1 font-plusmedium">Barang yang Dipinjam</label>
                            <div className="flex gap-2 items-center">
                                <input
                                    type="text"
                                    value={data.barang_id}
                                    placeholder="Masukkan Kode Barang"
                                    onChange={(e) => setData('barang_id', e.target.value)}
                                    className={inputClass + ' flex-1'}
                                />
                                <button type="button" onClick={handleCheckBarangId} className={checkButtonClass}>Cek ID</button>
                            </div>
                            {errors.barang_id && <p className="text-red-500 text-sm mt-1 font-plusregular">{errors.barang_id}</p>}
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-1 font-plusmedium">Tanggal & Waktu Pinjam</label>
                            <DatePicker
                                selected={data.tanggal_peminjam}
                                onChange={(date) => setData('tanggal_peminjam', date)}
                                dateFormat="yyyy-MM-dd HH:mm"
                                timeFormat="HH:mm"
                                showTimeSelect
                                locale="id"
                                placeholderText="Pilih tanggal dan waktu"
                                className={inputClass}
                                wrapperClassName="w-full"
                            />
                            {errors.tanggal_peminjam && <p className="text-red-500 text-sm mt-1 font-plusregular">{errors.tanggal_peminjam}</p>}
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-1 font-plusmedium">Tanggal & Waktu Kembali</label>
                            <DatePicker
                                selected={data.tanggal_kembali}
                                onChange={(date) => setData('tanggal_kembali', date)}
                                dateFormat="yyyy-MM-dd HH:mm"
                                timeFormat="HH:mm"
                                showTimeSelect
                                locale="id"
                                placeholderText="Pilih tanggal dan waktu"
                                className={inputClass}
                                wrapperClassName="w-full"
                            />
                            {errors.tanggal_kembali && <p className="text-red-500 text-sm mt-1 font-plusregular">{errors.tanggal_kembali}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1 font-plusmedium">Keperluan</label>
                        <textarea
                            value={data.keterangan}
                            placeholder="Contoh: Untuk praktek di Lab Komputer"
                            onChange={(e) => setData('keterangan', e.target.value)}
                            className={inputClass}
                            rows={3}
                        />
                        {errors.keterangan && <p className="text-red-500 text-sm mt-1 font-plusregular">{errors.keterangan}</p>}
                    </div>

                    <div className="flex justify-end pt-4">
                        <button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700 text-white font-plusmedium py-2 px-6 rounded-xl disabled:opacity-50 transition duration-150 ease-in-out">
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
