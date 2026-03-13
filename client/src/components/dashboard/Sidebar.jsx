import { NavLink } from "react-router-dom";
import { dashboardLinks } from "../../constants/navigation";
import { classNames } from "../../utils/classNames";
import { Icon } from "../common/Icons";
import icons from "../common/iconPaths";

function Sidebar() {
  return (
    <aside className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(15,23,42,0.84))] p-4 shadow-2xl shadow-slate-950/20">
      <p className="px-4 pb-4 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
        Workspace
      </p>
      <nav className="space-y-2">
        {dashboardLinks.map((link) => (
          <NavLink
            end={link.exact}
            key={link.to}
            className={({ isActive }) =>
              classNames(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition duration-300",
                isActive
                  ? "bg-[linear-gradient(135deg,rgba(103,232,249,0.95),rgba(250,204,21,0.92))] text-slate-950 shadow-lg shadow-cyan-500/20"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              )
            }
            to={link.to}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/10">
              <Icon className="h-4 w-4" path={icons[link.icon]} />
            </span>
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
