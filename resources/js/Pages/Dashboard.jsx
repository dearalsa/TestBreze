import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import 'dayjs/locale/id';

export default function Dashboard() {
    const { auth } = usePage().props;
    const user = auth.user;

    // Tanggal Indonesia
    const today = dayjs().locale('id').format('dddd, DD MMMM YYYY');

    return (
        <AuthenticatedLayout
            header={
                    <div>
                        <h2 className="font-semibold text-lg">Dashboard</h2>
                        <p className="text-sm text-black-200">{today}</p>
                    </div>
            }
        >
            <Head title="Dashboard" />

            <motion.div
                className="bg-[#3b5998] rounded-xl p-8 flex flex-col md:flex-row items-center justify-between"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Hai {user.name}!
                    </h1>
                    <p className="text-white">
                        Semoga harimu penuh semangat dan produktif 🤩
                    </p>
                    <p className="text-sm text-white/65 mt-2">
                        Akun dibuat pada:{' '}
                        <b>{dayjs(user.created_at).locale('id').format('DD MMMM YYYY, HH:mm')}</b>
                    </p>
                    {user.last_login_at && (
                        <p className="text-sm text-gray-500">
                            Login terakhir:{' '}
                            <b>{dayjs(user.last_login_at).locale('id').format('DD MMMM YYYY, HH:mm')}</b>
                        </p>
                    )}
                </div>

                <img
                    src="https://cdn-icons-png.flaticon.com/512/14036/14036432.png"
                    alt="Illustration"
                    className="w-48 mt-6 md:mt-0"
                />
            </motion.div>
        </AuthenticatedLayout>
    );
}
