import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getAssignedIssues } from "../services/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Clock, Wrench, CheckCircle, AlertTriangle, MapPin, Calendar } from "lucide-react";

export default function Dashboard() {
  const [issues, setIssues] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      const { data } = await getAssignedIssues();
      setIssues(data);
    } catch (error) {
      console.error("Error fetching issues:", error);
    }
  };

  const pending = issues.filter(i => i.status === "assigned").length;
  const inProgress = issues.filter(i => i.status === "in_progress").length;
  const resolved = issues.filter(i => i.status === "resolved").length;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
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
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const statsCards = [
    {
      title: "Assigned",
      value: pending,
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      description: "Issues waiting for action"
    },
    {
      title: "In Progress",
      value: inProgress,
      icon: Wrench,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: "Currently being worked on"
    },
    {
      title: "Resolved",
      value: resolved,
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      description: "Successfully completed"
    }
  ];

  // Get recent issues (last 3)
  const recentIssues = issues.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <motion.div
        className="flex-1 p-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div
          className="mb-8"
          variants={itemVariants}
        >
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Crew Dashboard</h1>
          <p className="text-slate-600">Welcome back! Here's your current workload overview.</p>
        </motion.div>

        {/* Quick link to full issue list */}
        <motion.div
          className="mb-8"
          variants={itemVariants}
        >
          <motion.div
            className="backdrop-blur-md bg-white/30 border border-white/20 rounded-2xl shadow-xl p-6 cursor-pointer"
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ duration: 0.3 }}
            onClick={() => setActivePage("allissues")}
          >
            <h3 className="text-xl font-semibold text-slate-800">View All Issues</h3>
            <p className="text-slate-600 mt-2">Manage and assign every issue in the system.</p>
          </motion.div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          variants={itemVariants}
        >
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                className="backdrop-blur-md bg-white/30 border border-white/20 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 text-center"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon size={24} className={stat.color} />
                </div>
                <div className="text-3xl font-bold text-slate-800 mb-2">{stat.value}</div>
                <div className="text-slate-600 font-medium">{stat.title}</div>
                <p className="text-sm text-slate-500 mt-2">{stat.description}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Recent Issues */}
        <motion.div
          className="mb-8"
          variants={itemVariants}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-slate-800">Recent Issues</h2>
            <motion.button
              onClick={() => navigate("/issues")}
              className="btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View All Issues
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentIssues.length > 0 ? (
              recentIssues.map((issue) => (
                <motion.div
                  key={issue._id}
                  className={`backdrop-blur-md bg-white/30 border border-white/20 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 border-l-4 ${issue.priority === 'high' ? 'border-red-500' : 'border-amber-500'}`}
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => navigate(`/issues/${issue._id}`)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-slate-800 truncate">{issue.title}</h3>
                    {issue.priority === 'high' && (
                      <AlertTriangle size={16} className="text-red-500 flex-shrink-0 ml-2" />
                    )}
                  </div>

                  <p className="text-slate-600 text-sm mb-3 line-clamp-2">{issue.description}</p>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center space-x-1">
                      <MapPin size={12} />
                      <span>
  {!issue.location
    ? 'Location TBD'
    : typeof issue.location === 'object'
    ? `${issue.location.lat.toFixed(4)}, ${issue.location.lng.toFixed(4)}`
    : issue.location}
</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar size={12} />
                      <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      issue.status === 'assigned' ? 'bg-amber-100 text-amber-800' :
                      issue.status === 'in_progress' ? 'bg-orange-100 text-orange-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {issue.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Wrench size={48} className="text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500">No issues assigned yet.</p>
                <p className="text-slate-400 text-sm">New assignments will appear here.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={itemVariants}
        >
          <motion.div
            className="backdrop-blur-md bg-white/30 border border-white/20 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-slate-800 mb-3">Today's Schedule</h3>
            <p className="text-slate-600 mb-4">Check your assigned tasks and plan your day efficiently.</p>
            <button
              onClick={() => navigate("/issues")}
              className="btn-secondary w-full"
            >
              View Schedule
            </button>
          </motion.div>

          <motion.div
            className="backdrop-blur-md bg-white/30 border border-white/20 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-slate-800 mb-3">Equipment Status</h3>
            <p className="text-slate-600 mb-4">Ensure all tools and vehicles are ready for deployment.</p>
            <button className="btn-secondary w-full opacity-50 cursor-not-allowed">
              Coming Soon
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}