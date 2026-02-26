import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { registerAdmin } from "../services/api";
import { Shield, User, Mail, Lock, ArrowRight } from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await registerAdmin({ name, email, password });
      alert("Registered successfully! Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 p-4">
      <motion.div
        className="w-full max-w-md"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Logo and Title */}
        <motion.div
          className="text-center mb-8"
          variants={itemVariants}
        >
          <motion.div
            className="flex justify-center mb-4"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            <Shield size={60} className="text-indigo-400" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">Join Admin Team</h1>
          <p className="text-slate-300">Create your administrative account</p>
        </motion.div>

        {/* Register Form */}
        <motion.div
          className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-semibold text-white text-center mb-6">Create Account</h2>

          <form className="space-y-6" onSubmit={handleRegister}>
            <motion.div
              variants={itemVariants}
              whileFocus={{ scale: 1.02 }}
            >
              <div className="relative">
                <User size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/20 border border-white/30 rounded-2xl text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileFocus={{ scale: 1.02 }}
            >
              <div className="relative">
                <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  placeholder="Administrator Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/20 border border-white/30 rounded-2xl text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileFocus={{ scale: 1.02 }}
            >
              <div className="relative">
                <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  placeholder="Secure Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/20 border border-white/30 rounded-2xl text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>
            </motion.div>

            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-300 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  Create Account
                  <ArrowRight size={20} className="ml-2" />
                </div>
              )}
            </motion.button>
          </form>

          <motion.div
            className="mt-6 text-center"
            variants={itemVariants}
          >
            <p className="text-slate-300">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors duration-300"
              >
                Sign in here
              </Link>
            </p>
          </motion.div>
        </motion.div>

        {/* Back to Home */}
        <motion.div
          className="text-center mt-6"
          variants={itemVariants}
        >
          <Link
            to="/"
            className="text-slate-400 hover:text-white transition-colors duration-300 text-sm"
          >
            ← Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}