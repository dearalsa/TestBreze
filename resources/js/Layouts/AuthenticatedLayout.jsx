import { useState, useEffect, useRef } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
  FaHome,
  FaUserCircle,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaChalkboardTeacher,
  FaBox,
  FaTags,
  FaUserGraduate,
  FaClipboardList,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Footer from "@/Components/Footer";

export default function AuthenticatedLayout({ header, children }) {
  const { user } = usePage().props.auth;
  const [collapsed, setCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const autoCollapsed = windowWidth < 768;

  const menuItems = [
    { name: "Dashboard", href: route("dashboard"), icon: <FaHome /> },
    { name: "Data Siswa", href: route("students.index"), icon: <FaUserGraduate /> },
    { name: "Data Guru", href: route("teachers.index"), icon: <FaChalkboardTeacher /> },
    { name: "Data Barang", href: route("inventories.index"), icon: <FaBox /> },
    { name: "Kategori Barang", href: route("categories.index"), icon: <FaTags /> },
    { name: "Peminjaman", href: route("peminjaman.index"), icon: <FaClipboardList /> },
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
    <div className="flex flex-col min-h-screen font-plusregular bg-white text-gray-900">
      <div className="flex flex-1">
        <motion.aside
          animate={{ width: collapsed || autoCollapsed ? "4rem" : "16rem" }}
          transition={{ duration: 0.3 }}
          className="bg-[#3b5998] rounded-3xl mx-4 my-4 flex flex-col justify-between p-4 text-white relative shadow-lg"
        >
          <div className="flex items-center mb-6 justify-between">
            {!(collapsed || autoCollapsed) && (
              <span className="text-white font-plusmedium text-lg pl-4">Menu</span>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="w-6 h-6 bg-white text-[#3b5998] rounded-full flex items-center justify-center shadow-md hover:scale-110 transition"
            >
              {collapsed ? <FaAngleDoubleRight /> : <FaAngleDoubleLeft />}
            </button>
          </div>

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

          {!collapsed && !autoCollapsed && (
            <motion.div
              className="mt-auto px-3 py-3 rounded-full bg-white/20 text-white text-sm"
              variants={userInfoVariants}
              initial="hidden"
              animate="show"
            >
              <div className="font-plusmedium truncate">{user.name}</div>
              <div className="text-xs truncate">{user.email}</div>
            </motion.div>
          )}
        </motion.aside>

        <div className="flex-1 flex flex-col">
          <header className="px-6 pt-6 pb-2 bg-white flex justify-between items-center">
            {header && <div>{header}</div>}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 bg-[#3b5998] text-white px-3 py-2 rounded-full hover:bg-[#2d4373] transition"
              >
                <FaUserCircle className="text-2xl" />
                <span className="hidden md:inline">{user.name}</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded-lg shadow-lg z-50 overflow-hidden">
                  <Link
                    href={route("profile.edit")}
                    className="block px-4 py-2 hover:bg-gray-100 transition"
                  >
                    Profile
                  </Link>
                  <Link
                    href={route("logout")}
                    method="post"
                    as="button"
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                  >
                    Logout
                  </Link>
                </div>
              )}
            </div>
          </header>

          <main className="flex-1 p-6 bg-white">{children}</main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
