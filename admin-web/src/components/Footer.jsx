import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Heart, Shield, FileText, BarChart3, Users } from "lucide-react";

function Footer() {
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
    <motion.footer
      className="bg-slate-900 text-white"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Shield size={20} className="text-indigo-400" />
              <span>Quick Links</span>
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#issues" className="flex items-center space-x-2 text-slate-300 hover:text-indigo-400 transition-colors duration-300">
                  <FileText size={16} />
                  <span>All Issues</span>
                </a>
              </li>
              <li>
                <a href="#analytics" className="flex items-center space-x-2 text-slate-300 hover:text-indigo-400 transition-colors duration-300">
                  <BarChart3 size={16} />
                  <span>Analytics</span>
                </a>
              </li>
              <li>
                <a href="#crew" className="flex items-center space-x-2 text-slate-300 hover:text-indigo-400 transition-colors duration-300">
                  <Users size={16} />
                  <span>Crew Management</span>
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Civic-AI Mission */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Heart size={20} className="text-indigo-400" />
              <span>Civic-AI Mission</span>
            </h3>
            <p className="text-slate-300 leading-relaxed">
              Empowering communities through intelligent civic management.
              Our AI-driven platform connects citizens with responsive municipal services,
              fostering transparency, efficiency, and community engagement.
            </p>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-slate-300">
                <Mail size={16} className="text-indigo-400" />
                <span>admin@civic-ai.gov</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-300">
                <Phone size={16} className="text-indigo-400" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-300">
                <MapPin size={16} className="text-indigo-400" />
                <span>City Hall, Civic Center</span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="border-t border-slate-700 mt-8 pt-8 text-center"
          variants={itemVariants}
        >
          <p className="text-slate-400">
            © 2026 Civic AI System. Built with ❤️ for community service.
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
}

export default Footer;