import React from "react";
import { Link } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";
import Footer from "../Components/common/Footer";
import pic from "../assets/images/home.svg";
const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans">
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-slate-100 to-orange-100 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="space-y-6 md:space-y-10 text-center lg:text-left">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-orange-500 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text">
                  Transform Your Skills into Success
                </h1>
                <p className="text-sm sm:text-md md:text-lg text-gray-600 max-w-lg mx-auto lg:mx-0">
                  Experience next-gen assessment technology that adapts to your
                  journey. Smart. Seamless. Future-ready.
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 lg:space-x-2 justify-center lg:justify-start">
                  <Link
                    to="/signup"
                    className="inline-flex w-1/2 mx-auto items-center justify-center px-6 sm:px-4 py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 text-sm sm:text-base"
                  >
                    Launch Your Journey
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex w-1/3 mx-auto items-center justify-center px-4 sm:px-2 py-3 sm:py-1 bg-white text-orange-600 font-medium rounded-full border-2 border-orange-500 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:bg-orange-50 text-sm sm:text-base"
                  >
                    Join US
                  </Link>
                </div>
              </div>
              <div className="relative mt-8 lg:mt-0">
                <img
                  src={pic}
                  alt="Online Assessment Illustration"
                  className="w-full max-w-md mx-auto lg:max-w-none h-auto rounded-full transform hover:scale-105 border-0 shadow-md hover:shadow-lg transition-all duration-300"
                />
              </div>
            </div>
          </div>
        </div>
        {/* Features Section */}
        <div className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-extrabold text-blue-950">
                Why Choose Us?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our platform offers cutting-edge assessment tools for candidates
                and recruiters, ensuring a seamless experience.
              </p>
            </div>

            <div className="mt-16 grid gap-8 grid-cols-1 md:grid-cols-3">
              {/* Feature 1 */}
              <div className="bg-gray-50 rounded-xl p-6 shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-2">
                <div className="flex items-center justify-center h-14 w-14 rounded-full bg-orange-500 text-white">
                  <FiCheckCircle className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  Prepare an assessment
                </h3>
                <p className="mt-2 text-gray-600">
                  Build online assessments in minutes with an intuitive and
                  easy-to-use question manager. Choose the most suitable
                  question types, set your assessment timers, activity period
                  and invite candidates or employees with just a few clicks.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-gray-50 rounded-xl p-6 shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-2">
                <div className="flex items-center justify-center h-14 w-14 rounded-full bg-orange-600 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  Give access
                </h3>
                <p className="mt-2 text-gray-600">
                  Experience full control over who takes your assessments and
                  when they do it. Share your assessments with employees or
                  candidates. No need to create user accounts to take tests
                  makes this assessment tool perfect for secure pre &
                  post-employment knowledge testing.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-gray-50 rounded-xl p-6 shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-2">
                <div className="flex items-center justify-center h-14 w-14 rounded-full bg-orange-600 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-blue-900">
                  Get insights
                </h3>
                <p className="mt-2 text-gray-600">
                  Access real-time results during your assessments and a wealth
                  of detailed, actionable data about your candidates' or
                  employees' knowledge right after the assessments are finished.
                  Measure the training impact. Gain an additional signal about
                  candidates and avoid pointless job interviews.
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Display Section */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-700 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              <span className="block">Ready to Get Started?</span>
              <span className="block text-slate-50">
                Sign Up for Free Today.
              </span>
            </h2>
            <div className="mt-8 lg:mt-0 lg:flex-shrink-0 flex space-x-4">
              <Link
                to="/signup"
                className="inline-flex items-center px-6 py-3 bg-white text-orange-600 font-medium rounded-lg shadow-lg hover:bg-gray-50 transition duration-300 ease-in-out transform hover:-translate-y-1"
              >
                Get Started
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center px-6 py-3 bg-orange-700 text-white font-medium rounded-lg shadow-lg hover:bg-orange-800 transition duration-300 ease-in-out transform hover:-translate-y-1"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
