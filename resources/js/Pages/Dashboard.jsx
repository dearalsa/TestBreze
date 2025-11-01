import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
export default function Dashboard() {
    const { auth, totals, activityLogs } = usePage().props;
    const user = auth.user;
    const today = dayjs().locale('id').format('dddd, DD MMMM YYYY');
    const totalStats = [
        { 
            title: 'Total Siswa', 
            value: totals?.siswa || 0, 
            color: 'text-indigo-600', 
            icon: 'M17.982 18.725A7.488 7.488 0 0012 15a7.493 7.493 0 00-5.982 3.725L7.5 19h9zM12 9a3 3 0 100-6 3 3 0 000 6z' // Icon Pengguna (Siswa)
        },
        { 
            title: 'Total Guru', 
            value: totals?.guru || 0, 
            color: 'text-green-600', 
            icon: 'M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z' // Icon Grup/Komunitas (Guru)
        },
        { 
            title: 'Total Barang', 
            value: totals?.barang || 0, 
            color: 'text-red-600', 
            icon: 'M20 10V8a2 2 0 00-2-2h-3M9 6H6a2 2 0 00-2 2v2M4 14v2a2 2 0 002 2h3m5 0h3a2 2 0 002-2v-2' // Icon Barang/Inventori
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>
                    <p className="text-sm text-gray-500">{today}</p>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="space-y-6">
                <motion.div
                    className="bg-gradient-to-r from-[#3b5998] to-[#6a84c0] rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between shadow-xl"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex-1">
                        <h1 className="text-3xl font-extrabold text-white mb-2">
                            Hai {user.name}!
                        </h1>
                        <p className="text-white">
                            Semoga harimu penuh semangat dan produktif 🤩
                        </p>
                        <div className="mt-3 text-sm text-white/80 space-y-1">
                            <p>
                                Akun dibuat pada:{' '}
                                <b className="font-semibold">{dayjs(user.created_at).locale('id').format('DD MMMM YYYY, HH:mm')}</b>
                            </p>
                            {user.last_login_at && (
                                <p>
                                    Login terakhir:{' '}
                                    <b className="font-semibold">{dayjs(user.last_login_at).locale('id').format('DD MMMM YYYY, HH:mm')}</b>
                                </p>
                            )}
                        </div>
                    </div>

                    <img
                        src="https://cdn-icons-png.flaticon.com/512/14036/14036432.png"
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://cdn-icons-png.flaticon.com/512/14036/14036432.png"; }}
                        alt="Ilustrasi Selamat Datang"
                        className="w-32 h-32 md:w-48 md:h-48 mt-6 md:mt-0 object-contain"
                    />
                </motion.div>

                <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
                    Statistik Total Data
                </h3>
                
                <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {totalStats.map((stat, index) => (
                        <motion.div
                            key={index}
                            className="bg-white overflow-hidden rounded-xl shadow-lg p-6 flex items-center space-x-4 border-l-4 border-indigo-500 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1"
                            variants={itemVariants}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <style jsx>{`
                                .border-l-4 {
                                    border-left-width: 4px;
                                }
                                .border-indigo-500 {
                                    border-left-color: ${stat.color === 'text-indigo-600' ? '#4f46e5' : 
                                                         stat.color === 'text-green-600' ? '#10b981' : 
                                                         stat.color === 'text-red-600' ? '#ef4444' : '#6b7280'};
                                }
                            `}</style>

                            <div className={`p-3 rounded-full ${stat.color.replace('text-', 'bg-')} bg-opacity-10`}>
                                <svg className={`w-8 h-8 ${stat.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 uppercase">{stat.title}</p>
                                <p className={`text-4xl font-extrabold ${stat.color} mt-1`}>{stat.value}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
                    Catatan Aktivitas Saya (5 Terbaru)
                </h3>
                
                <motion.div
                    className="bg-white overflow-hidden rounded-xl shadow-lg p-6"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    <ul className="space-y-4">
                        {Array.isArray(activityLogs) && activityLogs.length > 0 ? (
                            activityLogs.map((log, index) => (
                                <motion.li 
                                    key={log.id || index} 
                                    className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
                                >
                                    <p className="text-gray-800 font-medium">
                                        {log.description}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1 flex justify-between">
                                        <span>
                                            {dayjs(log.created_at).locale('id').format('dddd, DD MMMM YYYY, HH:mm')}
                                        </span>
                                        <span className="text-indigo-500 font-semibold">
                                            {dayjs(log.created_at).locale('id').fromNow()}
                                        </span>
                                    </p>
                                </motion.li>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-4">
                                Belum ada aktivitas tercatat untuk akun Anda. Mulai tambahkan data!
                            </p>
                        )}
                    </ul>
                </motion.div>
            </div>
        </AuthenticatedLayout>
    );
}