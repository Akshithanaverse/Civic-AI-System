import { Link } from "react-router-dom";
import { FileText, AlertTriangle, CheckCircle, Clock, MapPin, Plus } from "lucide-react";
import { motion } from "framer-motion";

function Home() {
  // Mock data for demonstration - in real app, this would come from API
  const recentReports = [
    {
      id: 1,
      title: "Pothole on Main Street",
      status: "In Progress",
      urgency: "Medium",
      date: "2026-02-20",
      location: "Main St & 5th Ave"
    },
    {
      id: 2,
      title: "Broken Streetlight",
      status: "Resolved",
      urgency: "Low",
      date: "2026-02-18",
      location: "Park Ave & Elm St"
    },
    {
      id: 3,
      title: "Garbage Pile",
      status: "Pending",
      urgency: "High",
      date: "2026-02-22",
      location: "River Rd & Oak St"
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "Resolved":
        return <CheckCircle className="text-green-500" size={20} />;
      case "In Progress":
        return <Clock className="text-blue-500" size={20} />;
      case "Pending":
        return <AlertTriangle className="text-orange-500" size={20} />;
      default:
        return <Clock className="text-gray-500" size={20} />;
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "High":
        return "text-red-600 bg-red-50";
      case "Medium":
        return "text-yellow-600 bg-yellow-50";
      case "Low":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        delay: 0.1
      }
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      {/* Hero Section */}
      <motion.div
        className="relative overflow-hidden"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            className="text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              className="text-5xl md:text-6xl font-bold text-slate-800 mb-6"
              variants={itemVariants}
            >
              Welcome to <span className="text-emerald-600">Civic AI</span>
            </motion.h1>
            <motion.p
              className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto"
              variants={itemVariants}
            >
              Report public issues in your city and track their resolution in real time with our AI-powered civic management system.
            </motion.p>

            {/* CTA Button */}
            <motion.div variants={itemVariants}>
              <Link
                to="/report"
                className="inline-flex items-center space-x-3 bg-emerald-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-emerald-700 transform hover:scale-105 transition-all duration-300 shadow-xl"
              >
                <Plus size={24} />
                <span>Report an Issue</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-emerald-100/20 to-teal-100/20 -z-10"></div>
      </motion.div>

      {/* My Reports Dashboard */}
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-slate-800 mb-4">My Reports Status</h2>
          <p className="text-slate-600">Track the progress of issues you've reported</p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {recentReports.map((report, index) => (
            <motion.div
              key={report.id}
              variants={cardVariants}
              whileHover="hover"
              className="backdrop-blur-md bg-white/30 border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(report.status)}
                  <span className="font-semibold text-slate-800">{report.status}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getUrgencyColor(report.urgency)}`}>
                  {report.urgency}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-slate-800 mb-2">{report.title}</h3>

              <div className="flex items-center space-x-2 text-slate-600 mb-2">
                <MapPin size={16} />
                <span className="text-sm">{report.location}</span>
              </div>

              <div className="flex items-center space-x-2 text-slate-500">
                <FileText size={16} />
                <span className="text-sm">Reported on {report.date}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Reports Button */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link
            to="/my-reports"
            className="inline-flex items-center space-x-2 bg-slate-600 text-white px-6 py-3 rounded-2xl font-medium hover:bg-slate-700 transition-colors duration-300"
          >
            <FileText size={18} />
            <span>View All Reports</span>
          </Link>
        </motion.div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        className="bg-white/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-slate-800 mb-4">How It Works</h2>
            <p className="text-slate-600">Our AI-powered system makes civic reporting simple and effective</p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="backdrop-blur-md bg-white/30 border border-white/20 rounded-2xl p-6 text-center shadow-xl"
            >
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="text-emerald-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Report Issues</h3>
              <p className="text-slate-600">Spotted a pothole or broken streetlight? Report it instantly with photos and details.</p>
            </motion.div>

            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="backdrop-blur-md bg-white/30 border border-white/20 rounded-2xl p-6 text-center shadow-xl"
            >
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-emerald-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">AI Analysis</h3>
              <p className="text-slate-600">Our AI automatically categorizes and prioritizes issues for faster resolution.</p>
            </motion.div>

            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="backdrop-blur-md bg-white/30 border border-white/20 rounded-2xl p-6 text-center shadow-xl"
            >
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="text-emerald-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Track Progress</h3>
              <p className="text-slate-600">Monitor the status of your reports and see real-time updates on resolution.</p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default Home;