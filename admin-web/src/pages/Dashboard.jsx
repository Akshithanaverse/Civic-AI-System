import { useState } from "react";
import Navbar from "../components/Navbar";
import AllIssues from "./AllIssues";
import Analytics from "./Analytics";
import CrewManagement from "./CrewManagement";

export default function Dashboard() {
  const [activePage, setActivePage] = useState("allissues");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar setActivePage={setActivePage} activePage={activePage} />
      <div className="flex-1 p-6 bg-gray-100">
        {activePage === "allissues" && <AllIssues />}
        {activePage === "analytics" && <Analytics />}
        {activePage === "crew" && <CrewManagement />}
      </div>
    </div>
  );
}