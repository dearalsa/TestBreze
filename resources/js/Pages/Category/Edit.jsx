import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import { FaArrowLeft } from 'react-icons/fa';

export default function Edit() {
  const { category } = usePage().props;

  const { data, setData, put, processing, errors } = useForm({
    category_name: category.category_name || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    put(route('categories.update', category.id));
  };

  const inputClass =
    'w-full border border-gray-300 rounded-xl p-3 bg-gray-50 text-base focus:outline-none focus:ring-0 focus:border-gray-300 focus:bg-gray-50';

  return (
    <AuthenticatedLayout>
      <Head title="Edit Kategori" />
      <div className="max-w-3xl mx-auto p-6">
        <Link
          href={route('categories.index')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
        >
          <FaArrowLeft /> Kembali ke Daftar Kategori
        </Link>

        <h2 className="text-3xl font-bold text-gray-800 mb-6">Edit Kategori</h2>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-2xl p-6 space-y-6"
        >
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Nama Kategori</label>
            <input
              type="text"
              value={data.category_name}
              onChange={(e) => setData('category_name', e.target.value)}
              className={inputClass}
            />
            {errors.category_name && (
              <p className="text-red-500 text-sm mt-1">{errors.category_name}</p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={processing}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl disabled:opacity-50"
            >
              {processing ? 'Menyimpan...' : 'Perbarui'}
            </button>
          </div>
        </form>
      </div>
    </AuthenticatedLayout>
  );
}
