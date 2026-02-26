import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import AllIssues from "./AllIssues";
import Analytics from "./Analytics";
import CrewManagement from "./CrewManagement";
import { FileText, AlertTriangle, Users, TrendingUp, Clock, CheckCircle } from "lucide-react";

export default function Dashboard() {
  const [activePage, setActivePage] = useState("allissues");
  const [stats, setStats] = useState({
    totalIssues: 0,
    pendingIssues: 0,
    resolvedIssues: 0,
    activeCrew: 0
  });

  // Mock stats - in real app, fetch from API
  useEffect(() => {
    setStats({
      totalIssues: 247,
      pendingIssues: 89,
      resolvedIssues: 158,
      activeCrew: 23
    });
  }, []);

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
      title: "Total Issues",
      value: stats.totalIssues,
      icon: FileText,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    },
    {
      title: "Pending Issues",
      value: stats.pendingIssues,
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-50"
    },
    {
      title: "Resolved Issues",
      value: stats.resolvedIssues,
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    },
    {
      title: "Active Crew",
      value: stats.activeCrew,
      icon: Users,
      color: "text-slate-600",
      bgColor: "bg-slate-50"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar setActivePage={setActivePage} activePage={activePage} />

      {activePage === "allissues" && (
        <motion.div
          className="flex-1 p-6"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Stats Overview */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
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
                </motion.div>
              );
            })}
          </motion.div>

          {/* Issues Management */}
          <motion.div variants={itemVariants}>
            <AllIssues />
          </motion.div>
        </motion.div>
      )}

      {activePage === "analytics" && (
        <motion.div
          className="flex-1 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Analytics />
        </motion.div>
      )}

      {activePage === "crew" && (
        <motion.div
          className="flex-1 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CrewManagement />
        </motion.div>
      )}
    </div>
  );
}