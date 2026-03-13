import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";

function MainLayout() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(251,191,36,0.12),transparent_28%)]" />
      <Navbar />
      <main className="relative">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
