import { useForm, Link, router } from "@inertiajs/react";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // 👈 tambahin ini
import { useState } from "react";

export default function Login() {
  const { data, setData, post, processing, errors } = useForm({
    email: "",
    password: "",
    remember: false,
  });

  const [showPassword, setShowPassword] = useState(false); // 👈 state buat icon mata

  const submit = (e) => {
    e.preventDefault();

    post(route("login"), {
      onSuccess: () => {
        router.visit(route("dashboard"));
      },
    });
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
          Welcome Back
        </h2>
        <p className="text-gray-700 text-center mt-2 text-sm sm:text-base font-comfortaa">
          Please login to continue
        </p>

        <form onSubmit={submit} className="mt-8 space-y-6">
          <div>
            <label className="block text-sm text-gray-700 font-comfortaa">Email</label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => setData("email", e.target.value)}
              placeholder="Enter your email"
              className="mt-2 block w-full appearance-none border-0 border-b-2 border-[#3b5998]/40 bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-[#3b5998] transition font-comfortaa text-sm sm:text-base"
            />
            {errors.email && <div className="text-red-500 text-xs font-comfortaa">{errors.email}</div>}
          </div>

          <div className="relative">
            <label className="block text-sm text-gray-700 font-comfortaa">Password</label>
            <input
              type={showPassword ? "text" : "password"} // 👈 ubah tipe input
              value={data.password}
              onChange={(e) => setData("password", e.target.value)}
              placeholder="Enter your password"
              className="mt-2 block w-full appearance-none border-0 border-b-2 border-[#3b5998]/40 bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-[#3b5998] transition font-comfortaa text-sm sm:text-base pr-10"
            />
            <div
              className="absolute right-0 bottom-2 translate-y-[-50%] pr-2 cursor-pointer text-[#3b5998]"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>

            {errors.password && <div className="text-red-500 text-xs font-comfortaa">{errors.password}</div>}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 text-sm text-gray-600 font-comfortaa">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={data.remember}
                onChange={(e) => setData("remember", e.target.checked)}
                className="h-4 w-4 rounded-md text-[#3b5998] focus:ring-[#3b5998] focus:ring-2 transition"
              />
              <span>Remember me</span>
            </label>
            <Link href={route("password.request")} className="hover:underline text-[#3b5998]">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={processing}
            className="w-full py-3 mt-4 rounded-lg font-comfortaa text-white bg-[#3b5998] hover:bg-[#2d4373] transition text-sm sm:text-base"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 font-comfortaa">
          Don’t have an account?{" "}
          <Link href={route("register")} className="text-[#3b5998] hover:underline">
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
