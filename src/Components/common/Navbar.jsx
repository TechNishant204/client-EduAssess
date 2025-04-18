// src/components/common/Navbar.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Logo from "../../assets/images/logo1.png";

const Navbar = ({ onLogout }) => {
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-stone-50 drop-shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img className="h-8 w-auto" src={Logo} alt="EduAssess" />
            </Link>
          </div>

          <div className="flex items-center">
            {currentUser ? (
              <div className="relative ml-3" ref={menuRef}>
                <div className="flex items-center">
                  <Link
                    to="/student/dashboard"
                    className="text-gray-700 hover:text-orange-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex text-sm rounded-full focus:outline-none"
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-orange-600">
                      {currentUser.firstName?.charAt(0) || "U"}
                    </div>
                  </button>
                  <div className="ml-2">
                    <div className="text-sm font-medium text-gray-700">
                      {currentUser.firstName} {currentUser.lastName}
                    </div>
                  </div>
                </div>
                {isOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                    <button
                      onClick={() => {
                        onLogout();
                        setIsOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-100"
                    >
                      Sign out
                    </button>
                    <Link
                      to="/profile"
                      onClick={() => setIsOpen(false)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-100"
                    >
                      User Profile
                    </Link>
                  </div>
                )}
              </div>
            ) : (
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
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
