import React from "react"; 
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const path = location.pathname.split("/")[1];

  return (
    <div className="flex-shrink-0 w-64 h-full bg-white shadow-md">
      <div className="p-5">
        <h1 className="flex items-center gap-1 mb-6">
          <span className="text-2xl font-bold">Menu</span>
        </h1>
        <div className="flex flex-col gap-2">
          <Link
            to="hero"
            className={`flex items-center gap-2 p-3 rounded text-gray-800 hover:bg-blue-200 ${path === "hero" ? "bg-blue-700 text-white" : ""}`}
          >Hero Dashboard</Link>
          <Link
            to="tasks"
            className={`flex items-center gap-2 p-3 rounded text-gray-800 hover:bg-blue-200 ${path === "tasks" ? "bg-blue-700 text-white" : ""}`}
          >Tasks</Link>
          <Link
            to="goals"
            className={`flex items-center gap-2 p-3 rounded text-gray-800 hover:bg-blue-200 ${path === "goals" ? "bg-blue-700 text-white" : ""}`}
          >Personal Goals</Link>
          <Link
            to="calendar"
            className={`flex items-center gap-2 p-3 rounded text-gray-800 hover:bg-blue-200 ${path === "calendar" ? "bg-blue-700 text-white" : ""}`}
          >Calendar</Link>
          <Link
            to="settings"
            className={`flex items-center gap-2 p-3 rounded text-gray-800 hover:bg-blue-200 ${path === "settings" ? "bg-blue-700 text-white" : ""}`}
          >Settings</Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;