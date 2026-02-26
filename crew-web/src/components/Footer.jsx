import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Heart, HardHat, Home, FileText } from "lucide-react";

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
              <HardHat size={20} className="text-amber-400" />
              <span>Quick Links</span>
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="/dashboard" className="flex items-center space-x-2 text-slate-300 hover:text-amber-400 transition-colors duration-300">
                  <Home size={16} />
                  <span>Dashboard</span>
                </a>
              </li>
              <li>
                <a href="/issues" className="flex items-center space-x-2 text-slate-300 hover:text-amber-400 transition-colors duration-300">
                  <FileText size={16} />
                  <span>Assigned Issues</span>
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Civic-AI Mission */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Heart size={20} className="text-amber-400" />
              <span>Civic-AI Mission</span>
            </h3>
            <p className="text-slate-300 leading-relaxed">
              Empowering field crews with intelligent tools and real-time coordination.
              Our platform ensures efficient response times and quality service delivery
              for community needs.
            </p>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-slate-300">
                <Mail size={16} className="text-amber-400" />
                <span>crew@civic-ai.gov</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-300">
                <Phone size={16} className="text-amber-400" />
                <span>+1 (555) 987-6543</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-300">
                <MapPin size={16} className="text-amber-400" />
                <span>Field Operations Center</span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="border-t border-slate-700 mt-8 pt-8 text-center"
          variants={itemVariants}
        >
          <p className="text-slate-400">
            © 2026 Civic AI System. Built with ❤️ for field service excellence.
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
}

export default Footer;