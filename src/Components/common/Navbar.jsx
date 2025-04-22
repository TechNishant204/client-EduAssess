import React, { useState, useRef, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Logo from "../../assets/images/logo1.png";
import UserLogo from "../../assets/images/user.png"; // Placeholder for user logo
import { HiMenu } from "react-icons/hi";
import { HiX } from "react-icons/hi";

const Navbar = ({ onLogout }) => {
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // when the user click outside the menu, close the menu
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Role-based dashboard link
  const getDashboardLink = () => {
    if (!currentUser) return "/";
    if (currentUser.role === "admin") return "/admin/dashboard";
    if (currentUser.role === "student") return "/student/dashboard";
    return "/";
  };

  // Role-based dashboard label
  const getDashboardLabel = () => {
    if (!currentUser) return "";
    if (currentUser.role === "admin") return "Admin Dashboard";
    if (currentUser.role === "student") return "Dashboard";
    return "";
  };

  const UserMenu = () => (
    <div className="relative ml-3" ref={menuRef}>
      <div className="flex items-center">
        <Link
          to={getDashboardLink()}
          className="text-gray-700 hover:text-orange-600 px-3 py-2 rounded-md text-sm font-medium"
        >
          {getDashboardLabel()}
        </Link>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex text-sm rounded-full focus:outline-none"
          aria-haspopup="true"
          aria-expanded={isOpen}
          aria-label="User menu"
        >
          <img
            src={UserLogo}
            alt="User"
            className="h-8 w-8 rounded-full object-cover"
          />
        </button>
        <div className="ml-2">
          <div className="text-sm font-medium text-gray-700">
            {currentUser.firstName} {currentUser.lastName}
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-10">
          <Link
            to="/profile"
            onClick={() => setIsOpen(false)}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-100"
          >
            User Profile
          </Link>
          <button
            onClick={() => {
              onLogout();
              setIsOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-100"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );

  const GuestMenu = () => (
    <div className="flex items-center">
      <Link
        to="/login"
        className="text-gray-700 hover:text-orange-600 px-3 py-2 rounded-md text-sm font-medium hover:border-2 hover:border-primary hover:scale-105"
      >
        Log in
      </Link>
      <Link
        to="/signup"
        className="ml-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
      >
        Create New Account
      </Link>
    </div>
  );

  return (
    <nav className="bg-stone-100 shadow-gray-300 drop-shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo section */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img className="h-8 w-auto" src={Logo} alt="EduAssess" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-orange-600"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger icon */}
              <HiMenu className={`${isOpen ? "hidden" : "block"} h-6 w-6`} />
              {/* Close icon */}
              <HiX className={`${isOpen ? "block" : "hidden"} h-6 w-6`} />
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden sm:flex sm:items-center">
            {currentUser ? <UserMenu /> : <GuestMenu />}
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${isOpen ? "block" : "hidden"} sm:hidden pb-4`}>
          {currentUser ? (
            <div className="pt-2 pb-3 space-y-1">
              <Link
                to={getDashboardLink()}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-600"
                onClick={() => setIsOpen(false)}
              >
                {getDashboardLabel()}
              </Link>
              <Link
                to="/profile"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-600"
                onClick={() => setIsOpen(false)}
              >
                User Profile
              </Link>
              <button
                onClick={() => {
                  onLogout();
                  setIsOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-600"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="pt-2 pb-3 space-y-1">
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-600"
                onClick={() => setIsOpen(false)}
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-600"
                onClick={() => setIsOpen(false)}
              >
                Create New Account
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
