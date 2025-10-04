import { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import { 
  FaHome, 
  FaUser, 
  FaSignOutAlt, 
  FaAngleDoubleLeft, 
  FaAngleDoubleRight, 
  FaFileAlt // ✅ tambahin ini
} from "react-icons/fa";

export default function AuthenticatedLayout({ header, children }) {
  const { user } = usePage().props.auth;
  const [collapsed, setCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const autoCollapsed = windowWidth < 768;

  const menuItems = [
    { name: "Dashboard", href: route("dashboard"), icon: <FaHome /> },
    { name: "Profile", href: route("profile.edit"), icon: <FaUser /> },
    { name: "Data Siswa", href: route("students.index"), icon: <FaFileAlt /> }, // ✅ Data Siswa
    { name: "Logout", href: route("logout"), icon: <FaSignOutAlt />, method: "post", as: "button" },
  ];

  const menuItemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  const userInfoVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="flex min-h-screen font-comfortaa bg-white text-gray-900">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed || autoCollapsed ? "4rem" : "16rem" }}
        transition={{ duration: 0.3 }}
        className="bg-[#3b5998] rounded-3xl mx-4 my-4 flex flex-col justify-between p-4 text-white relative shadow-lg"
      >
        {/* Header / Judul Sidebar */}
        <div className="flex items-center mb-6 justify-between">
          {!(collapsed || autoCollapsed) && (
            <span className="text-white font-semibold text-lg">Dashboard</span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-6 h-6 bg-white text-[#3b5998] rounded-full flex items-center justify-center shadow-md hover:scale-110 transition"
          >
            {collapsed ? <FaAngleDoubleRight /> : <FaAngleDoubleLeft />}
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 flex flex-col gap-3">
          {menuItems.map((item) => (
            <motion.div
              key={item.name}
              variants={menuItemVariants}
              initial="hidden"
              animate="show"
              whileHover={{ scale: 1.05 }}
            >
              <Link
                href={item.href}
                method={item.method}
                as={item.as}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-full hover:bg-[#2d4373] transition ${
                  collapsed || autoCollapsed ? "justify-center" : "justify-start"
                }`}
              >
                <div className="text-white text-xl flex-shrink-0">{item.icon}</div>
                {!(collapsed || autoCollapsed) && (
                  <span className="whitespace-nowrap">{item.name}</span>
                )}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* User Info */}
        {!collapsed && !autoCollapsed && (
          <motion.div
            className="mt-auto px-3 py-3 rounded-full bg-white/20 text-white text-sm"
            variants={userInfoVariants}
            initial="hidden"
            animate="show"
          >
            <div className="font-semibold truncate">{user.name}</div>
            <div className="text-xs truncate">{user.email}</div>
          </motion.div>
        )}
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {header && (
          <header className="px-6 pt-6 pb-2 bg-white">
            {header}
          </header>
        )}
        <main className="flex-1 p-6 bg-white">{children}</main>
      </div>
    </div>
  );
}
