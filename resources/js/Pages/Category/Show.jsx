import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { FaArrowLeft } from 'react-icons/fa';

export default function Show() {
  const { category } = usePage().props;

  return (
    <AuthenticatedLayout>
      <Head title="Detail Kategori" />
      <div className="max-w-3xl mx-auto p-6">
        <Link
          href={route('categories.index')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
        >
          <FaArrowLeft /> Kembali ke Daftar Kategori
        </Link>

        <h2 className="text-3xl font-bold text-gray-800 mb-6">Detail Kategori</h2>

        <div className="bg-white shadow-md rounded-2xl p-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Nama Kategori</h3>
            <p className="text-gray-600">{category.category_name}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700">Dibuat Pada</h3>
            <p className="text-gray-600">{new Date(category.created_at).toLocaleString()}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700">Diperbarui Pada</h3>
            <p className="text-gray-600">{new Date(category.updated_at).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
