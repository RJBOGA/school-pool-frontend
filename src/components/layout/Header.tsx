import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown, LogOut, User, History } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { UserRole } from "../../types/enums";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };
  const getHistoryPath = (userRole?: UserRole) => {
    return userRole === UserRole.STUDENT ? "/user/history" : "/rides/history";
  };

  return (
    <header className="bg-white shadow-sm fixed w-full top-0 z-50">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-red-500">UCMO</span> 
      <span className="text-2xl font-bold text-primary-600"> SchoolPool</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {!user ? (
              <>
                <Link
                  to="/info#about"
                  className="text-gray-600 hover:text-primary-600"
                >
                  About
                </Link>
                <Link
                  to="/info#how-it-works"
                  className="text-gray-600 hover:text-primary-600"
                >
                  How It Works
                </Link>
                <Link
                  to="/info#contact"
                  className="text-gray-600 hover:text-primary-600"
                >
                  Contact
                </Link>
                <div className="space-x-4">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-primary-600 hover:text-primary-700"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                  >
                    Sign Up
                  </Link>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/info#about"
                  className="text-gray-600 hover:text-primary-600"
                >
                  About
                </Link>
                <Link
                  to="/info#how-it-works"
                  className="text-gray-600 hover:text-primary-600"
                >
                  How It Works
                </Link>
                <Link
                  to="/info#contact"
                  className="text-gray-600 hover:text-primary-600"
                >
                  Contact
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 px-4 py-2 rounded-md hover:bg-gray-50"
                  >
                    <span>{user.firstName}</span>
                    <ChevronDown size={20} />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-100">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <User size={16} className="mr-2" />
                        Profile
                      </Link>
                      <Link
                        to={getHistoryPath(user?.role)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <History size={16} className="mr-2" />
                        History
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <LogOut size={16} className="mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-4">
              {!user ? (
                <>
                  <Link
                    to="/info#about"
                    className="text-gray-600 hover:text-primary-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link
                    to="/info#how-it-works"
                    className="text-gray-600 hover:text-primary-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    How It Works
                  </Link>
                  <Link
                    to="/info#contact"
                    className="text-gray-600 hover:text-primary-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Contact
                  </Link>
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-center text-primary-600 hover:text-primary-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-2 text-center bg-primary-600 text-white rounded-md hover:bg-primary-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/profile"
                    className="text-gray-600 hover:text-primary-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-primary-600 text-left"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
