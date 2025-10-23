import { useForm, Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Register() {
  const { data, setData, post, processing, errors } = useForm({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirm = () => setShowConfirm(!showConfirm);

  const submit = (e) => {
    e.preventDefault();

    // Validasi format email umum
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      alert("Masukkan email yang valid!");
      return;
    }

    // Validasi khusus Gmail aja
    const gmailRegex = /^[^\s@]+@gmail\.com$/i;
    if (!gmailRegex.test(data.email)) {
      alert("Masukkan email dengan benar!");
      return;
    }

    post(route("register"));
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 bg-gradient-to-br from-[#dfefff] via-[#a7c8f7] to-[#3b5998]">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md bg-white/40 backdrop-blur-xl p-6 sm:p-8 rounded-2xl shadow-2xl"
      >
        <h2 className="text-2xl sm:text-3xl font-black font-comfortaa text-[#1a2c38] text-center">
          Register
        </h2>
        <p className="text-gray-700 text-center mt-2 text-sm sm:text-base font-comfortaa">
          Create your account
        </p>

        <form onSubmit={submit} className="mt-8 space-y-6">
          <div>
            <label className="block text-sm text-gray-700 font-comfortaa">Name</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => setData("name", e.target.value)}
              placeholder="Enter your name"
              className="mt-2 block w-full border-0 border-b-2 border-[#3b5998]/40 bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-[#3b5998] transition font-comfortaa text-sm sm:text-base"
            />
            {errors.name && <div className="text-red-500 text-xs font-comfortaa">{errors.name}</div>}
          </div>

          <div>
            <label className="block text-sm text-gray-700 font-comfortaa">Email</label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => setData("email", e.target.value)}
              placeholder="Enter your email"
              required
              className="mt-2 block w-full border-0 border-b-2 border-[#3b5998]/40 bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-[#3b5998] transition font-comfortaa text-sm sm:text-base"
            />
            {errors.email && <div className="text-red-500 text-xs font-comfortaa">{errors.email}</div>}
          </div>

          <div className="relative">
            <label className="block text-sm text-gray-700 font-comfortaa">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={data.password}
              onChange={(e) => setData("password", e.target.value)}
              placeholder="Enter your password"
              className="mt-2 block w-full border-0 border-b-2 border-[#3b5998]/40 bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-[#3b5998] transition font-comfortaa text-sm sm:text-base pr-10"
            />
            <button
              type="button"
              onClick={togglePassword}
              className="absolute right-2 bottom-2 text-gray-600 hover:text-[#3b5998]"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.password && <div className="text-red-500 text-xs font-comfortaa">{errors.password}</div>}
          </div>

          <div className="relative">
            <label className="block text-sm text-gray-700 font-comfortaa">Confirm Password</label>
            <input
              type={showConfirm ? "text" : "password"}
              value={data.password_confirmation}
              onChange={(e) => setData("password_confirmation", e.target.value)}
              placeholder="Re-enter your password"
              className="mt-2 block w-full border-0 border-b-2 border-[#3b5998]/40 bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-[#3b5998] transition font-comfortaa text-sm sm:text-base pr-10"
            />
            <button
              type="button"
              onClick={toggleConfirm}
              className="absolute right-2 bottom-2 text-gray-600 hover:text-[#3b5998]"
            >
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.password_confirmation && (
              <div className="text-red-500 text-xs font-comfortaa">{errors.password_confirmation}</div>
            )}
          </div>

          <button
            type="submit"
            disabled={processing}
            className="w-full py-3 mt-4 rounded-lg font-comfortaa text-white bg-[#3b5998] hover:bg-[#2d4373] transition text-sm sm:text-base"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 font-comfortaa">
          Already have an account?{" "}
          <Link href={route("login")} className="text-[#3b5998] hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
