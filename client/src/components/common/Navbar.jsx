import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import Button from "./Button";
import { Icon } from "./Icons";
import icons from "./iconPaths";
import { classNames } from "../../utils/classNames";
import { isAdminUser } from "../../utils/admin";

function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItemClass = ({ isActive }) =>
    classNames(
    "nav-link text-sm transition",
      isActive && "nav-link-active"
    );

  return (
    <header className="site-header sticky top-0 z-40 border-b backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link className="flex items-center gap-3 text-stone-900" to="/">
          <div className="brand-mark flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-semibold">
            LF
          </div>
          <div>
            <p className="text-sm font-semibold">Lost & Found</p>
            <p className="text-xs text-stone-500">Recovery workspace</p>
          </div>
        </Link>

        <nav className="nav-links hidden items-center gap-1 rounded-full p-1.5 md:flex">
          <NavLink className={navItemClass} to="/">
            Home
          </NavLink>
          <NavLink className={navItemClass} to="/dashboard">
            Dashboard
          </NavLink>
          <NavLink className={navItemClass} to="/report-item">
            Report Item
          </NavLink>
          {isAdminUser(user) ? (
            <NavLink className={navItemClass} to="/admin">
              Admin
            </NavLink>
          ) : null}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link
                className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm text-stone-700 transition hover:border-emerald-800/30 hover:bg-emerald-50"
                to="/dashboard/settings"
              >
                {user.name}
              </Link>
              <Button className="px-4 py-2" variant="secondary" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link className="text-sm text-stone-700 hover:text-emerald-900" to="/login">
                Sign in
              </Link>
              <Link to="/register">
                <Button className="px-4 py-2">Get started</Button>
              </Link>
            </>
          )}
        </div>

        <button
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          type="button"
          className="rounded-full border border-stone-200 bg-white p-2 text-emerald-950 md:hidden"
          onClick={() => setMenuOpen((value) => !value)}
        >
          <Icon path={menuOpen ? icons.close : icons.menu} />
        </button>
      </div>

      {menuOpen ? (
        <div className="mobile-menu border-t px-6 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            <Link className="rounded-2xl px-4 py-3 text-sm text-stone-700 hover:bg-stone-100" onClick={() => setMenuOpen(false)} to="/">
              Home
            </Link>
            <Link
              className="rounded-2xl px-4 py-3 text-sm text-stone-700 hover:bg-stone-100"
              onClick={() => setMenuOpen(false)}
              to="/dashboard"
            >
              Dashboard
            </Link>
            <Link
              className="rounded-2xl px-4 py-3 text-sm text-stone-700 hover:bg-stone-100"
              onClick={() => setMenuOpen(false)}
              to="/report-item"
            >
              Report Item
            </Link>
            {isAdminUser(user) ? (
              <Link className="rounded-2xl px-4 py-3 text-sm text-stone-700 hover:bg-stone-100" onClick={() => setMenuOpen(false)} to="/admin">
                Admin
              </Link>
            ) : null}
            {user ? (
              <button className="rounded-2xl px-4 py-3 text-left text-sm text-rose-700 hover:bg-rose-50" onClick={() => { setMenuOpen(false); logout(); }}>
                Logout
              </button>
            ) : (
              <Link className="rounded-2xl px-4 py-3 text-sm text-stone-700 hover:bg-stone-100" onClick={() => setMenuOpen(false)} to="/login">
                Sign in
              </Link>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}

export default Navbar;
