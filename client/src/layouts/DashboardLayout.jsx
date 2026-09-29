import { Outlet } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";

function DashboardLayout() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
      <div className="grid gap-6 lg:grid-cols-[300px,1fr] xl:gap-8">
        <Sidebar />
        <div className="surface-card min-w-0 rounded-[28px] border p-5 md:p-7">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
