// src/components/Sidebar.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import Logo from "../../assets/images/logo1.png";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: "My Tests", icon: "📋", path: "/Dashboard" },
    { name: "Profile", icon: "👤", path: "/profile" },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleLogout = () => {
    logout();
    // Redirect to login page after logout (handled by AuthContext or router)
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg transition-all duration-300 ease-in-out z-50 ${
          isOpen ? "w-64" : "w-16"
        }`}
      >
        {/* Logo and Toggle Button */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            {isOpen && (
              <img
                src={Logo} // Replace with your logo path
                alt="EduAssess Logo"
                className="h-8 w-auto"
              />
            )}
          </div>
          <button
            onClick={toggleSidebar}
            className="text-gray-600 hover:text-gray-800"
          >
            {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="mt-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center p-4 text-gray-600 hover:bg-blue-100 hover:text-blue-600 ${
                location.pathname === item.path
                  ? "bg-blue-100 text-blue-600"
                  : ""
              } ${!isOpen ? "justify-center" : ""}`}
            >
              <span className="text-xl">{item.icon}</span>
              {isOpen && <span className="ml-3">{item.name}</span>}
            </Link>
          ))}
        </nav>

        {/* User Dropdown */}
        <div className="absolute bottom-4 w-full px-4">
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center w-full p-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              <FaUserCircle size={20} />
              {isOpen && <span className="ml-3">User</span>}
              <svg
                className={`ml-auto h-4 w-4 transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {dropdownOpen && isOpen && (
              <div className="absolute bottom-full left-0 w-full bg-white shadow-lg rounded mt-2">
                <Link
                  to="/dashboard"
                  className="block px-4 py-2 text-gray-600 hover:bg-blue-100"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Main Content */}
      <div
        className={`flex-1 ml-${
          isOpen ? "64" : "16"
        } transition-all duration-300 ease-in-out`}
      >
        {/* Your main content goes here */}
      </div>
    </div>
  );
};

export default Sidebar;
