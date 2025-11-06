import { useState } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, useForm, Link } from '@inertiajs/react'
import { FaArrowLeft, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import id from 'date-fns/locale/id'

registerLocale('id', id)

export default function EditPeminjaman({ peminjaman }) {
  const { data, setData, put, processing, errors } = useForm({
    peminjam_id: peminjaman.peminjam_id || '',
    role: peminjaman.role || '',
    barang_id: peminjaman.barang_id || '',
    tanggal_peminjam: peminjaman.tanggal_peminjam ? new Date(peminjaman.tanggal_peminjam + 'Z') : null,
    tanggal_kembali: peminjaman.tanggal_kembali ? new Date(peminjaman.tanggal_kembali + 'Z') : null,
    keterangan: peminjaman.keterangan || '',
  })

  const [notification, setNotification] = useState({ message: '', type: '' })

  const inputClass =
    'w-full border border-gray-300 rounded-xl p-3 bg-gray-50 text-base focus:outline-none focus:ring-0 focus:border-gray-300 focus:bg-gray-50 active:bg-gray-50 font-plusregular'

  const formatDateToMySQL = (date) => {
    if (!date) return null
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = '00';
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  function submit(e) {
    e.preventDefault()
    put(route('peminjaman.update', peminjaman.id), {
      data: {
        ...data,
        tanggal_peminjam: formatDateToMySQL(data.tanggal_peminjam),
        tanggal_kembali: formatDateToMySQL(data.tanggal_kembali),
      },
    })
  }

  return (
    <AuthenticatedLayout>
      <Head title="Edit Peminjaman" />
      <div className="max-w-4xl mx-auto p-6 font-plusregular">
        <Link
          href={route('peminjaman.index')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 font-plusmedium"
        >
          <FaArrowLeft /> Kembali ke Daftar Peminjaman
        </Link>

        <h2 className="text-3xl text-gray-800 mb-6 font-plusmedium">Edit Data Peminjaman</h2>

        {notification.message && (
          <div
            className={`p-4 mb-6 rounded-xl flex items-center gap-3 ${
              notification.type === 'warning'
                ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                : 'bg-green-100 text-green-700 border border-green-300'
            } font-plusregular`}
          >
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
              <select
                value={data.role}
                onChange={(e) => setData('role', e.target.value)}
                className={inputClass}
              >
                <option value="">Pilih</option>
                <option value="Siswa">Siswa</option>
                <option value="Guru">Guru</option>
              </select>
              {errors.role && (
                <p className="text-red-500 text-sm mt-1 font-plusregular">{errors.role}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-1 font-plusmedium">ID Peminjam</label>
              <input
                type="text"
                value={data.peminjam_id}
                onChange={(e) => setData('peminjam_id', e.target.value)}
                className={inputClass}
                placeholder="Masukkan NISN/NIP"
              />
              {errors.peminjam_id && (
                <p className="text-red-500 text-sm mt-1 font-plusregular">{errors.peminjam_id}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-1 font-plusmedium">Barang yang Dipinjam</label>
              <input
                type="text"
                value={data.barang_id}
                onChange={(e) => setData('barang_id', e.target.value)}
                className={inputClass}
                placeholder="Masukkan Kode Barang"
              />
              {errors.barang_id && (
                <p className="text-red-500 text-sm mt-1 font-plusregular">{errors.barang_id}</p>
              )}
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
              {errors.tanggal_peminjam && (
                <p className="text-red-500 text-sm mt-1 font-plusregular">{errors.tanggal_peminjam}</p>
              )}
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
              {errors.tanggal_kembali && (
                <p className="text-red-500 text-sm mt-1 font-plusregular">{errors.tanggal_kembali}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-plusmedium">Keperluan</label>
            <textarea
              value={data.keterangan}
              onChange={(e) => setData('keterangan', e.target.value)}
              className={inputClass}
              rows={3}
              placeholder="Contoh: Untuk praktek di Lab Komputer"
            />
            {errors.keterangan && (
              <p className="text-red-500 text-sm mt-1 font-plusregular">{errors.keterangan}</p>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={processing}
              className="bg-blue-600 hover:bg-blue-700 text-white font-plusmedium py-2 px-6 rounded-xl disabled:opacity-50 transition duration-150 ease-in-out"
            >
              {processing ? 'Menyimpan...' : 'Perbarui Data'}
            </button>
          </div>
        </form>
      </div>
    </AuthenticatedLayout>
  )
}