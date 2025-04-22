// src/Components/common/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-2">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} EduAssess . All rights reserved.
        </p>
        <div className="mt-2">
          <a href="*" className="text-gray-400 hover:text-white mx-2">
            About
          </a>
          <a href="*" className="text-gray-400 hover:text-white mx-2">
            Contact
          </a>
          <a href="*" className="text-gray-400 hover:text-white mx-2">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
