import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAirlineTheme } from '../context/AirlineThemeContext';

const Navbar = () => {
  const { themeConfig } = useAirlineTheme();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsAuthenticated(!!token);
    setUserRole(localStorage.getItem('userRole'));
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('accessToken');
      setIsAuthenticated(!!token);
      setUserRole(localStorage.getItem('userRole'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
    setIsAuthenticated(false);
    setUserRole(null);
    navigate('/');
    window.location.reload();
  };

  const navGradientStyle = themeConfig.airline ? {
    background: `linear-gradient(90deg, ${themeConfig.colors.primary} 0%, ${themeConfig.colors.secondary} 100%)`
  } : {};

  return (
    <nav className="glass-panel sticky top-0 z-50 transition-colors duration-500 bg-gradient-to-r from-indigo-700 via-blue-700 to-indigo-900" 
         style={themeConfig.airline ? navGradientStyle : {}}>
      {!themeConfig.airline && (
        <div className="h-1 w-full bg-tricolor-bar"></div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className={`text-3xl font-display font-bold tracking-tight tricolor-text ${themeConfig.airline ? '' : ''}`}>
              Bharat Airways
            </Link>
          </div>
          <div className="flex items-center space-x-8">
            <Link to="/" className={`font-semibold hover:opacity-80 transition-opacity ${themeConfig.airline ? 'text-white/90' : 'text-gray-700 hover:text-india-saffron'}`}>Home</Link>
            <Link to="/search" className={`font-semibold hover:opacity-80 transition-opacity ${themeConfig.airline ? 'text-white/90' : 'text-gray-700 hover:text-india-saffron'}`}>Book Flights</Link>
            <Link to="/profile" className={`font-semibold hover:opacity-80 transition-opacity ${themeConfig.airline ? 'text-white/90' : 'text-gray-700 hover:text-india-saffron'}`}>My Trips</Link>
            {userRole === 'admin' && (
              <Link to="/admin" className={`font-semibold hover:opacity-80 transition-opacity ${themeConfig.airline ? 'text-white/90' : 'text-gray-700 hover:text-india-saffron'}`}>Admin</Link>
            )}
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className={`px-5 py-2 rounded-full font-medium transition-transform transform hover:-translate-y-0.5 ${themeConfig.airline ? 'bg-white text-gray-900' : 'bg-gray-100 text-gray-900 border border-gray-200'}`}
                >
                  Logout
                </button>
              ) : (
                <Link to="/login" className={`px-5 py-2 rounded-full font-medium transition-transform transform hover:-translate-y-0.5 ${themeConfig.airline ? 'bg-white text-gray-900' : 'bg-gray-100 text-gray-900 border border-gray-200'}`}>
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
