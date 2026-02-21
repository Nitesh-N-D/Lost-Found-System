import { Link, NavLink } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const linkClasses = ({ isActive }) =>
    `hover:text-blue-400 transition ${
      isActive ? "text-blue-400 font-semibold" : ""
    }`;

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 shadow-md relative">
      <div className="flex justify-between items-center">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold tracking-wide hover:text-blue-400 transition"
        >
          Lost&Found
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6 text-sm font-medium">

          <NavLink to="/" className={linkClasses}>
            Home
          </NavLink>

          {user && (
            <>
              <NavLink to="/dashboard" className={linkClasses}>
                Dashboard
              </NavLink>

              <NavLink to="/create" className={linkClasses}>
                Create
              </NavLink>

              <NavLink to="/my-claims" className={linkClasses}>
                My Claims
              </NavLink>

              <NavLink to="/received-claims" className={linkClasses}>
                Received
              </NavLink>
            </>
          )}

          {!user && (
            <>
              <NavLink to="/login" className={linkClasses}>
                Login
              </NavLink>

              <NavLink to="/register" className={linkClasses}>
                Register
              </NavLink>
            </>
          )}

          {/* Profile Avatar */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center font-bold"
              >
                {user.name?.charAt(0).toUpperCase()}
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-40 bg-white text-black rounded-lg shadow-lg py-2">
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setProfileOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setProfileOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden mt-4 space-y-3 text-sm font-medium">

          <NavLink to="/" className={linkClasses} onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>

          {user && (
            <>
              <NavLink to="/dashboard" className={linkClasses} onClick={() => setMenuOpen(false)}>
                Dashboard
              </NavLink>

              <NavLink to="/create" className={linkClasses} onClick={() => setMenuOpen(false)}>
                Create
              </NavLink>

              <NavLink to="/my-claims" className={linkClasses} onClick={() => setMenuOpen(false)}>
                My Claims
              </NavLink>

              <NavLink to="/received-claims" className={linkClasses} onClick={() => setMenuOpen(false)}>
                Received
              </NavLink>

              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="block text-red-500"
              >
                Logout
              </button>
            </>
          )}

          {!user && (
            <>
              <NavLink to="/login" className={linkClasses} onClick={() => setMenuOpen(false)}>
                Login
              </NavLink>

              <NavLink to="/register" className={linkClasses} onClick={() => setMenuOpen(false)}>
                Register
              </NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;