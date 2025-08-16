import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bot, LogOut, User, Moon, Sun } from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  compact?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ darkMode, toggleDarkMode, compact = false }) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex justify-between items-center ${compact ? 'h-12' : 'h-16'}`}>
          {/* Logo and Title */}
          <div className="flex items-center">
            <div className={`bg-indigo-600 rounded-lg ${compact ? 'p-1.5' : 'p-2'}`}>
              <Bot className={`text-white ${compact ? 'h-4 w-4' : 'h-6 w-6'}`} />
            </div>
            <h1 className={`ml-3 font-semibold text-gray-900 dark:text-white ${compact ? 'text-lg' : 'text-xl'}`}>
              Todo AI
            </h1>
          </div>

          {/* Right side - Dark mode toggle and User menu */}
          <div className={`flex items-center ${compact ? 'space-x-2' : 'space-x-4'}`}>
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`${compact ? 'p-1.5' : 'p-2'} text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700`}
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun className={compact ? "h-4 w-4" : "h-5 w-5"} /> : <Moon className={compact ? "h-4 w-4" : "h-5 w-5"} />}
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`flex items-center ${compact ? 'space-x-1' : 'space-x-2'} text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors ${compact ? 'p-1.5' : 'p-2'} rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700`}
              >
                <div className={`bg-indigo-100 dark:bg-indigo-900 ${compact ? 'p-1.5' : 'p-2'} rounded-full`}>
                  <User className={`${compact ? "h-3 w-3" : "h-4 w-4"} text-indigo-600 dark:text-indigo-400`} />
                </div>
                <span className={`font-medium ${compact ? 'text-sm' : ''}`}>{user?.username}</span>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user?.username}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user?.email}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop to close user menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
