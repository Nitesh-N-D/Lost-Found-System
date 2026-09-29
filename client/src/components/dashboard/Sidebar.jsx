import { NavLink } from "react-router-dom";
import { dashboardLinks } from "../../constants/navigation";
import { classNames } from "../../utils/classNames";
import { Icon } from "../common/Icons";
import icons from "../common/iconPaths";

function Sidebar() {
  return (
    <aside className="surface-card rounded-[28px] border p-4">
      <p className="eyebrow px-4 pb-4 text-xs font-semibold uppercase">
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
                  ? "bg-emerald-900 text-white shadow-lg shadow-emerald-950/10"
                  : "text-stone-600 hover:bg-stone-100 hover:text-emerald-950"
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
