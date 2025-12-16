import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/UserSlice";
import logo from "../assets/logo.png";
import "./Header.css";
import { FaBars, FaTimes, FaUserCircle, FaSignOutAlt, FaUser, FaCog } from "react-icons/fa";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
    setShowDropdown(false);
  };

  const confirmLogout = () => {
    dispatch(logout());
    navigate("/login");
    setIsMobileMenuOpen(false);
    setShowLogoutDialog(false);
  };

  const cancelLogout = () => {
    setShowLogoutDialog(false);
  };

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo Section */}
        <Link to="/" className="logo-section" onClick={() => setIsMobileMenuOpen(false)}>
          <img src={logo} alt="Tadreej Logo" className="logo-img" />
          <span className="logo-text">Tadreej</span>
        </Link>

        {/* Mobile Menu Toggle */}
        <div className="mobile-toggle" onClick={toggleMenu}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </div>

        {/* Navigation Links */}
        <nav className={`nav-menu ${isMobileMenuOpen ? "active" : ""}`}>
          <ul className="nav-links">
            <li>
              <Link 
                to={user?.email ? "/project-intro" : "/"} 
                className={
                  (user?.email && location.pathname === "/project-intro") || 
                  (!user?.email && location.pathname === "/") 
                    ? "active" 
                    : ""
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/roadmap" 
                className={location.pathname === "/roadmap" ? "active" : ""}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Journey
              </Link>
            </li>
            <li>
              <Link 
                to="/freelancers" 
                className={location.pathname === "/freelancers" ? "active" : ""}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Freelancers
              </Link>
            </li>
            <li>
              <Link 
                to="/courses" 
                className={location.pathname === "/courses" ? "active" : ""}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Courses
              </Link>
            </li>
            {user?.email && (
              <li>
                <Link 
                  to="/suggestions" 
                  className={location.pathname === "/suggestions" ? "active" : ""}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Suggestions
                </Link>
              </li>
            )}
            {user?.role === 'admin' && (
              <li>
                <Link 
                  to="/admin" 
                  className={location.pathname === "/admin" ? "active" : ""}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              </li>
            )}
          </ul>

          {/* Auth Section (Inside nav-menu for mobile layout) */}
          <div className="auth-section">
            {user?.email && (
              <div className="user-profile" ref={dropdownRef}>
                <div 
                  className="user-info"
                  onClick={() => setShowDropdown(!showDropdown)}
                  style={{ cursor: 'pointer' }}
                  title="Click for menu"
                >
                  <FaUserCircle className="user-icon" />
                  <span className="user-name">{user.uname || "User"}</span>
                </div>
                
                {showDropdown && (
                  <div className="user-dropdown">
                    <div className="dropdown-header">
                      <span className="dropdown-email">{user.email}</span>
                    </div>
                    <div className="dropdown-divider"></div>
                    <Link 
                      to="/profile" 
                      className="dropdown-item"
                      onClick={() => setShowDropdown(false)}
                    >
                      <FaUser className="dropdown-icon" /> My Profile
                    </Link>
                    <div 
                      className="dropdown-item"
                      onClick={handleLogoutClick}
                    >
                      <FaSignOutAlt className="dropdown-icon" /> Logout
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>

        {/* Logout Confirmation Dialog */}
        {showLogoutDialog && (
          <div className="logout-dialog-overlay" onClick={cancelLogout}>
            <div className="logout-dialog" onClick={(e) => e.stopPropagation()}>
              <h3 className="dialog-title">Confirm Logout</h3>
              <p className="dialog-message">Are you sure you want to logout?</p>
              <div className="dialog-buttons">
                <button className="btn-cancel" onClick={cancelLogout}>
                  Cancel
                </button>
                <button className="btn-confirm-logout" onClick={confirmLogout}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
