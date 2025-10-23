import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import {
    Calendar,
    Users,
    TrendingUp,
    FolderKanban,
    Rocket,
} from 'lucide-react';

export default function Welcome({ auth }) {
    useEffect(() => {
        const link = document.createElement('link');
        link.href =
            'https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;600;700&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    }, []);

    const features = [
        {
            icon: <Calendar className="w-10 h-10 text-blue-500 dark:text-blue-400" />,
            title: 'Jadwal Otomatis',
            desc: 'Tugas otomatis dikelompokkan berdasarkan tenggat waktu untuk memudahkan pengaturan prioritas.',
        },
        {
            icon: <Users className="w-10 h-10 text-blue-500 dark:text-blue-400" />,
            title: 'Kolaborasi Tim',
            desc: 'Kerjakan proyek bersama teman sekelas dengan fitur komentar dan pembagian tugas.',
        },
        {
            icon: <TrendingUp className="w-10 h-10 text-blue-500 dark:text-blue-400" />,
            title: 'Progress Tracker',
            desc: 'Pantau perkembangan tugas dengan visual grafik dan status real-time.',
        },
    ];

    return (
        <>
            <Head title="Sha Task Manager" />

            <div
                className="font-[Comfortaa] bg-gradient-to-b from-blue-100 via-white to-blue-50 
                dark:from-gray-900 dark:via-gray-950 dark:to-black text-gray-800 dark:text-gray-100 
                min-h-screen flex flex-col transition-all duration-700 ease-out"
            >
                <header
                    className="flex justify-between items-center px-6 sm:px-10 py-4 shadow-md 
                    bg-white/70 dark:bg-gray-800/60 backdrop-blur-md sticky top-0 z-50 transition-all duration-300"
                >
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex items-center gap-2"
                    >
                        <FolderKanban className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 
                        bg-clip-text text-transparent">
                            Sha Task Manager
                        </h1>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Link
                            href={auth?.user ? route('dashboard') : route('register')}
                            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-5 py-2 
                            rounded-lg font-semibold text-sm sm:text-base hover:scale-105 shadow-sm hover:shadow-md 
                            transition-all duration-300 flex items-center gap-2"
                        >
                            <Rocket className="w-4 h-4" />
                            Get Started
                        </Link>
                    </motion.div>
                </header>

                <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4"
                    >
                        Kelola Tugasmu Lebih Mudah
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-600 dark:text-gray-300 max-w-xl mb-8 text-sm sm:text-base leading-relaxed"
                    >
                        Catat, atur, dan pantau progres tugas sekolahmu dengan mudah menggunakan
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                            {' '}
                            Sha Task Manager
                        </span>
                        . Dirancang untuk pelajar modern yang ingin tetap produktif dan rapi.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Link
                            href={auth?.user ? route('dashboard') : route('register')}
                            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-7 py-2.5 
                            rounded-lg font-semibold text-sm sm:text-base hover:scale-105 hover:shadow-md 
                            transition-all duration-300 flex items-center gap-2"
                        >
                            <Rocket className="w-4 h-4" />
                            Get Started
                        </Link>
                    </motion.div>
                </main>

                <section className="grid gap-6 md:grid-cols-3 px-8 sm:px-16 pb-16">
                    {features.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2 + 0.3 }}
                            whileHover={{
                                scale: 1.05,
                            }}
                            className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-5 cursor-pointer 
                            transition-all duration-300 hover:bg-gradient-to-b hover:from-blue-50 
                            dark:hover:from-gray-700 hover:to-indigo-50 dark:hover:to-gray-800"
                        >
                            <div className="mb-3 flex justify-center">{item.icon}</div>
                            <h3 className="text-base sm:text-lg font-semibold mb-1 text-blue-600 dark:text-blue-400 text-center">
                                {item.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed text-center">
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}
                </section>

                <footer className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-5 text-center text-xs sm:text-sm">
                    © 2025 Putri Salsabila. All rights reserved.
                </footer>
            </div>
        </>
    );
}