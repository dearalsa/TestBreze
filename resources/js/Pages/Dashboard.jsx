import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import relativeTime from 'dayjs/plugin/relativeTime';
import { FaUserGraduate, FaChalkboardTeacher, FaBox, FaTags } from 'react-icons/fa';

dayjs.extend(relativeTime);

export default function Dashboard() {
  const { auth, totals, activityLogs } = usePage().props;
  const user = auth.user;
  const today = dayjs().locale('id').format('dddd, DD MMMM YYYY');

  const totalStats = [
    {
      title: 'Siswa',
      value: totals?.siswa || 0,
      color: '#635985', 
      icon: FaUserGraduate,
    },
    {
      title: 'Guru',
      value: totals?.guru || 0,
      color: '#443C68', 
      icon: FaChalkboardTeacher,
    },
    {
      title: 'Barang',
      value: totals?.barang || 0,
      color: '#393053', 
      icon: FaBox,
    },
    {
      title: 'Kategori Barang',
      value: totals?.kategori || 0,
      color: '#18122B', 
      icon: FaTags,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <AuthenticatedLayout
      header={
        <div>
          <h2 className="font-plusmedium text-xl text-gray-800 leading-tight">Dashboard</h2>
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
            <h1 className="text-3xl font-plusmedium text-white mb-2">
              Hai {user.name}!
            </h1>
            <p className="text-white">
              Semoga harimu penuh semangat dan produktif 🤩
            </p>
            <div className="mt-3 text-sm text-white/80 space-y-1">
              <p>
                Akun dibuat pada:{' '}
                <b className="font-semibold">
                  {dayjs(user.created_at).locale('id').format('DD MMMM YYYY, HH:mm')}
                </b>
              </p>
              {user.last_login_at && (
                <p>
                  Login terakhir:{' '}
                  <b className="font-semibold">
                    {dayjs(user.last_login_at).locale('id').format('DD MMMM YYYY, HH:mm')}
                  </b>
                </p>
              )}
            </div>
          </div>

          <img
            src="https://cdn-icons-png.flaticon.com/512/14036/14036432.png"
            alt="Ilustrasi Selamat Datang"
            className="w-32 h-32 md:w-48 md:h-48 mt-6 md:mt-0 object-contain"
          />
        </motion.div>

        <h3 className="text-2xl font-plusmedium text-gray-800 mt-8 mb-4">
          Statistik Total Data
        </h3>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {totalStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-md p-5 flex items-center space-x-4 border-l-4 hover:shadow-xl transition duration-300 transform hover:-translate-y-1"
                variants={itemVariants}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                style={{ borderLeftColor: stat.color }}
              >
                <IconComponent className="text-4xl" style={{ color: stat.color }} />
                <div>
                  <p className="text-sm font-plusmedium text-gray-500 uppercase">
                    {stat.title}
                  </p>
                  <p
                    className="text-2xl font-extrabold"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <h3 className="text-2xl font-plusmedium text-gray-800 mt-8 mb-4">
          Aktivitas Saya 
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
                  <p className="text-gray-800 font-plusregular">{log.description}</p>
                  <p className="text-xs text-gray-500 mt-1 flex justify-between">
                    <span>
                      {dayjs(log.created_at)
                        .locale('id')
                        .format('dddd, DD MMMM YYYY, HH:mm')}
                    </span>
                    <span className="text-indigo-500 font-plusmedium">
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
