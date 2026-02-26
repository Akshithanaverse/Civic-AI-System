import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { registerCrew } from "../services/api";
import { HardHat, User, Mail, Lock, ArrowRight } from "lucide-react";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await registerCrew(form);
      alert("Registered successfully");
      navigate("/login");
    } catch (err) {
      alert("Registration failed");
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-900 via-orange-900 to-amber-800 p-4">
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
            <HardHat size={60} className="text-amber-400" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">Join Field Team</h1>
          <p className="text-orange-100">Become part of our service crew</p>
        </motion.div>

        {/* Register Form */}
        <motion.div
          className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-semibold text-white text-center mb-6">Create Account</h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <motion.div
              variants={itemVariants}
              whileFocus={{ scale: 1.02 }}
            >
              <div className="relative">
                <User size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-300" />
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full pl-12 pr-4 py-4 bg-white/20 border border-white/30 rounded-2xl text-white placeholder-orange-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-300"
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileFocus={{ scale: 1.02 }}
            >
              <div className="relative">
                <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-300" />
                <input
                  type="email"
                  placeholder="Crew Email"
                  className="w-full pl-12 pr-4 py-4 bg-white/20 border border-white/30 rounded-2xl text-white placeholder-orange-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-300"
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileFocus={{ scale: 1.02 }}
            >
              <div className="relative">
                <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-300" />
                <input
                  type="password"
                  placeholder="Secure Password"
                  className="w-full pl-12 pr-4 py-4 bg-white/20 border border-white/30 rounded-2xl text-white placeholder-orange-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-300"
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>
            </motion.div>

            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full bg-amber-600 text-white py-4 rounded-2xl font-semibold hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-amber-800 transition-all duration-300 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
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
                  Join Team
                  <ArrowRight size={20} className="ml-2" />
                </div>
              )}
            </motion.button>
          </form>

          <motion.div
            className="mt-6 text-center"
            variants={itemVariants}
          >
            <p className="text-orange-200">
              Already part of the team?{" "}
              <Link
                to="/login"
                className="text-amber-400 hover:text-amber-300 font-medium transition-colors duration-300"
              >
                Sign in here
              </Link>
            </p>
          </motion.div>
        </motion.div>

        {/* Safety Notice */}
        <motion.div
          className="text-center mt-6"
          variants={itemVariants}
        >
          <p className="text-orange-300 text-sm">
            ⚠️ Field work requires safety training. Contact supervisor for orientation.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}