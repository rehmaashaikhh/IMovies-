import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BiSun,
  BiPlusCircle,
  BiHistory,
  BiLogOut,
  BiHeart,
  BiUser,
} from 'react-icons/bi';
import { HiOutlineHome } from 'react-icons/hi2';
import { RiMovie2Line } from 'react-icons/ri';
import { FaTheaterMasks } from 'react-icons/fa';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddMenu, setShowAddMenu] = useState(false);

  const isAdminRoute = location.pathname.startsWith('/admin');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/movies?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/movies');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="cinema-navbar-exact d-flex justify-content-between align-items-center">
      {/* Brand on Left (Matching all screenshots) */}
      <Link to="/" className="brand-logo text-decoration-none">
        <span className="brand-i">i</span>Movies
      </Link>

      {/* ADMIN NAVBAR (Matching Images 1, 2, 3, 4, 5 in Admin Mode) */}
      {isAdminRoute || isAdmin ? (
        <div className="d-flex align-items-center gap-3 position-relative">
          {/* 1. Theme Sun Icon */}
          <button type="button" className="navbar-icon-btn" title="Toggle Theme">
            <BiSun size={20} />
          </button>

          {/* 2. Home Icon */}
          <Link to="/" className="navbar-icon-btn" title="Home">
            <HiOutlineHome size={20} />
          </Link>

          {/* 3. Movie Clapperboard Icon (Catalogue) */}
          <Link to="/movies" className="navbar-icon-btn" title="Available Movies">
            <RiMovie2Line size={20} />
          </Link>

          {/* 4. Plus Icon with Dropdown Menu (Add Movie, Add Show, Add Theatre) */}
          <div className="dropdown">
            <button
              type="button"
              className="navbar-icon-btn"
              title="Add Movie / Show / Theatre"
              onClick={() => setShowAddMenu(!showAddMenu)}
            >
              <BiPlusCircle size={20} />
            </button>
            {showAddMenu && (
              <div
                className="dropdown-menu dropdown-menu-dark show position-absolute end-0 mt-2 shadow border-secondary"
                style={{ zIndex: 1060 }}
              >
                <Link
                  to="/admin?tab=addMovie"
                  className="dropdown-item py-2"
                  onClick={() => setShowAddMenu(false)}
                >
                  + Add Movie
                </Link>
                <Link
                  to="/admin?tab=addShow"
                  className="dropdown-item py-2"
                  onClick={() => setShowAddMenu(false)}
                >
                  + Add Show
                </Link>
                <Link
                  to="/admin?tab=addTheatre"
                  className="dropdown-item py-2"
                  onClick={() => setShowAddMenu(false)}
                >
                  + Add Theatre
                </Link>
              </div>
            )}
          </div>

          {/* 5. Theatre Masks Icon (Admin Shows) */}
          <Link to="/admin?tab=shows" className="navbar-icon-btn" title="Admin Shows">
            <FaTheaterMasks size={20} />
          </Link>

          {/* 6. History Clock Icon (All Bookings) */}
          <Link to="/admin?tab=bookings" className="navbar-icon-btn" title="All Bookings">
            <BiHistory size={20} />
          </Link>

          {/* 7. Logout / Exit Icon */}
          <button
            type="button"
            className="navbar-icon-btn text-danger"
            title="Sign Out"
            onClick={handleLogout}
          >
            <BiLogOut size={21} />
          </button>
        </div>
      ) : (
        /* USER NAVBAR (Matching Image 4 UserProducts & User Orders exactly) */
        <div className="d-flex align-items-center gap-3">
          {/* Search Bar with Red "i" Button */}
          <form onSubmit={handleSearchSubmit} className="user-search-wrapper d-none d-sm-flex">
            <input
              type="text"
              className="user-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="user-search-icon-btn">
              i
            </button>
          </form>

          {/* Sun Icon */}
          <button type="button" className="navbar-icon-btn" title="Toggle Theme">
            <BiSun size={20} />
          </button>

          {/* Home Icon */}
          <Link to="/" className="navbar-icon-btn" title="Home">
            <HiOutlineHome size={20} />
          </Link>

          {/* Heart Outline Icon (Watchlist) */}
          <Link to="/favorites" className="navbar-icon-btn" title="Favorites">
            <BiHeart size={20} />
          </Link>

          {/* User Icon */}
          {isAuthenticated ? (
            <Link to="/bookings" className="navbar-icon-btn" title={`Account: ${user?.username || user?.email}`}>
              <BiUser size={20} />
            </Link>
          ) : (
            <Link to="/login" className="navbar-icon-btn" title="Sign In">
              <BiUser size={20} />
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
