// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { icons } from "../utils/icons";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const Navbar = ({
  isSidebarExpanded,
  setIsSidebarExpanded,
  isSidebarOpen,
  setIsSidebarOpen,
  setIsAddModalOpen,
  searchTerm,
  setSearchTerm,
}) => {
  const location = useLocation();
  const navItems = [
    { name: "Dashboard", path: "/main", icon: icons.Dashboard },
    { name: "Pipeline", path: "/main/pipeline", icon: icons.Pipeline },
    { name: "Team", path: "/main/team", icon: icons.Team },
    { name: "Profile", path: "/main/profile", icon: icons.Profile },
    { name: "Settings", path: "/main/settings", icon: icons.Settings },
    { name: "About", path: "/main/about", icon: icons.Info },
  ];
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const username = storedUser?.username || storedUser?.email || "User";
  const navigate = useNavigate();
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <>
      <div className="flex min-h-screen bg-gray-50 overflow-hidden">

        {/* ---------- SIDEBAR ---------- */}
        <aside
          className={`hidden lg:flex flex-col bg-white border-r transition-all duration-300 shadow-xl
        ${isSidebarExpanded ? "w-72" : "w-20"}`}
        >
          <div className="flex items-center justify-between p-4">
            {isSidebarExpanded && (
              <Link
                to="/main"
                className="text-4xl font-black tracking-tight text-blue-700 cursor-pointer hover:text-blue-900 transition"
              >
                TRACKATHON
              </Link>
            )}

          </div>
          <nav className="space-y-2 px-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center p-3 rounded-xl transition-all duration-200 w-full
                ${isSidebarExpanded ? "space-x-3 justify-start" : "justify-center"}
                text-gray-800 hover:bg-blue-100 hover:text-blue-800
                ${location.pathname === item.path ? "bg-blue-100 text-blue-700 font-semibold" : ""}`}
              >
                {item.icon}
                {isSidebarExpanded && <span>{item.name}</span>}
              </Link>
            ))}
          </nav>
        </aside>
        {/* ---------- HEADER + CONTENT ---------- */}
        <div className="flex flex-col flex-grow">

          {/* HEADER */}
          {/* HEADER */}
          <header className="flex items-center justify-between p-4 bg-white border-b sticky top-0 z-20 shadow-sm">

            {/* Sidebar Toggle */}
            <div className="flex items-center gap-3">
              <button
                className="hidden lg:block p-2 rounded-full hover:bg-gray-100"
                onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
              >
                {icons.Menu}
              </button>

              {/* Mobile Sidebar Toggle */}
              <button
                className="lg:hidden p-2 rounded-full hover:bg-gray-100"
                onClick={() => setIsSidebarOpen(true)}
              >
                {icons.Menu}
              </button>

              {/* 👋 Greeting */}
              <span className="text-5xl font-semibold text-gray-700">
                Hello, <span className="text-blue-600 font-bold">{username}</span> 👋
              </span>
            </div>

            {/* ✅ Right side section */}
            <div className="flex items-center gap-4">

              {/* 📅 Today's Date */}
              <button
                onClick={() => setShowCalendar(true)}
                className="px-6 py-3 rounded-xl text-xl font-semibold 
             bg-gradient-to-r from-blue-50 to-blue-100
             border border-blue-300 shadow-lg min-w-60 text-center
             text-blue-700 tracking-wide hover:scale-105 transition-transform"
              >
                {selectedDate.toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </button>


              <button className="p-2 rounded-full hover:bg-gray-100">
                {icons.DarkMode}
              </button>

              <button className="p-2 rounded-full hover:bg-gray-100">
                {icons.Bell}
              </button>

              {/* Profile button */}
              <button
                className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                onClick={() => navigate("/main/profile")}
              >
                {icons.User}
              </button>
            </div>
          </header>


          {/* PAGE CONTENT */}
          <main className="flex-grow p-4 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
      {/* ✅ CALENDAR MODAL (NOW INSIDE RETURN) */}
      {showCalendar && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-[999] backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 animate-fadeIn">
            <h2 className="text-2xl font-semibold text-blue-700 mb-4 text-center">
              Select a date
            </h2>

            <Calendar
              onChange={(date) => {
                setSelectedDate(date);
                setShowCalendar(false);
              }}
              value={selectedDate}
              className="rounded-xl"
            />

            <button
              className="w-full mt-4 py-2 px-4 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              onClick={() => setShowCalendar(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
export default Navbar;
