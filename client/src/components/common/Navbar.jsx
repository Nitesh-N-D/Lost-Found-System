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
      "text-sm text-slate-300 transition hover:text-white",
      isActive && "text-white"
    );

  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-slate-950/75 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link className="flex items-center gap-3 text-white" to="/">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-sm font-semibold text-white">
            LF
          </div>
          <div>
            <p className="text-sm font-semibold">Lost & Found</p>
            <p className="text-xs text-slate-500">Recovery workspace</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] p-1.5 md:flex">
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
                className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-slate-200 transition hover:border-white/20 hover:bg-white/[0.06]"
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
              <Link className="text-sm text-slate-200" to="/login">
                Sign in
              </Link>
              <Link to="/register">
                <Button className="px-4 py-2">Get started</Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="rounded-full border border-white/10 bg-white/[0.03] p-2 text-white md:hidden"
          onClick={() => setMenuOpen((value) => !value)}
        >
          <Icon path={menuOpen ? icons.close : icons.menu} />
        </button>
      </div>

      {menuOpen ? (
        <div className="border-t border-white/8 bg-slate-950/95 px-6 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            <Link className="rounded-2xl px-4 py-3 text-sm text-slate-200 hover:bg-white/[0.04]" onClick={() => setMenuOpen(false)} to="/">
              Home
            </Link>
            <Link
              className="rounded-2xl px-4 py-3 text-sm text-slate-200 hover:bg-white/[0.04]"
              onClick={() => setMenuOpen(false)}
              to="/dashboard"
            >
              Dashboard
            </Link>
            <Link
              className="rounded-2xl px-4 py-3 text-sm text-slate-200 hover:bg-white/[0.04]"
              onClick={() => setMenuOpen(false)}
              to="/report-item"
            >
              Report Item
            </Link>
            {isAdminUser(user) ? (
              <Link className="rounded-2xl px-4 py-3 text-sm text-slate-200 hover:bg-white/[0.04]" onClick={() => setMenuOpen(false)} to="/admin">
                Admin
              </Link>
            ) : null}
            {user ? (
              <button className="rounded-2xl px-4 py-3 text-left text-sm text-rose-300 hover:bg-white/[0.04]" onClick={logout}>
                Logout
              </button>
            ) : (
              <Link className="rounded-2xl px-4 py-3 text-sm text-white hover:bg-white/[0.04]" onClick={() => setMenuOpen(false)} to="/login">
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
