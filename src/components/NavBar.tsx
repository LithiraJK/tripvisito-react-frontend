import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/icons/logo.svg";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      <nav className="flex justify-between items-center py-4">
        <Link to="/" className="flex flex-row items-center gap-2 z-50">
          <img src={logo} alt="logo" className="size-8 sm:size-9" />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Tripvisito</h1>
        </Link>

        <div className="hidden lg:flex items-center gap-4">
          <Link 
            to="/admin/dashboard" 
            className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
          >
            Admin Panel
          </Link>
          <Link 
            to="/login" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Register
          </Link>
        </div>

        <button
          onClick={toggleSidebar}
          className="lg:hidden z-50 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed top-0 left-0 bottom-0 w-[280px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <Link to="/" onClick={closeSidebar} className="flex items-center gap-2">
              <img src={logo} alt="logo" className="size-8" />
              <h1 className="text-xl font-bold text-gray-900">Tripvisito</h1>
            </Link>
            <button
              onClick={closeSidebar}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Sidebar Navigation */}
          <div className="flex-1 overflow-y-auto p-4">
            <nav className="flex flex-col space-y-2">
              <Link 
                to="/admin/dashboard" 
                onClick={closeSidebar}
                className="text-gray-700 hover:bg-gray-100 font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Admin Panel
              </Link>
              <Link 
                to="/login" 
                onClick={closeSidebar}
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium text-center transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={closeSidebar}
                className="bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium text-center transition-colors"
              >
                Register
              </Link>
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
};

export default NavBar;
