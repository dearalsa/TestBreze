import { useForm, Link } from "@inertiajs/react";
import { motion } from "framer-motion";

export default function ForgotPassword() {
  const { data, setData, post, processing, errors } = useForm({
    email: "",
  });

  const submit = (e) => {
    e.preventDefault();
    post(route("password.email")); // route default breeze untuk kirim email reset
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
          Forgot Password
        </h2>

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
            {errors.email && <div className="text-red-500 text-xs">{errors.email}</div>}
          </div>

          <button
            type="submit"
            disabled={processing}
            className="w-full py-3 mt-4 rounded-lg font-comfortaa text-white bg-[#3b5998] hover:bg-[#2d4373] transition text-sm sm:text-base"
          >
            Send Reset Link
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 font-comfortaa">
          Remember your password?{" "}
          <Link href={route("login")} className="text-[#3b5998] hover:underline">
            Back to Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
