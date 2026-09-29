import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";

function MainLayout() {
  return (
    <div className="app-shell min-h-screen">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(138,190,157,0.13),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(220,190,133,0.10),transparent_28%)]" />
      <Navbar />
      <main className="relative">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
