import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminService } from "../../services/adminService";
import Button from "../../components/common/Button";

function AdminPanel() {
  const [dashboard, setDashboard] = useState(null);

  const loadDashboard = async () => {
    try {
      setDashboard(await adminService.getDashboard());
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    let active = true;

    adminService
      .getDashboard()
      .then((data) => {
        if (active) setDashboard(data);
      })
      .catch((error) => toast.error(error.message));

    return () => {
      active = false;
    };
  }, []);

  if (!dashboard) return null;

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
      <div className="grid gap-6 lg:grid-cols-3">
        {[
          ["Total users", dashboard.stats.totalUsers],
          ["Total items", dashboard.stats.totalItems],
          ["Active claims", dashboard.stats.activeClaims],
        ].map(([label, value]) => (
          <div key={label} className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-slate-400">{label}</p>
            <p className="mt-4 text-4xl font-semibold text-white">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <section className="rounded-[32px] border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-semibold text-white">Users</h2>
          <div className="mt-5 space-y-4">
            {dashboard.users.map((user) => (
              <div
                key={user._id}
                className="flex flex-col gap-3 rounded-[24px] bg-slate-950/60 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-semibold text-white">{user.name}</p>
                  <p className="text-sm text-slate-400">{user.email}</p>
                </div>
                <Button
                  onClick={async () => {
                    await (user.isBanned
                      ? adminService.unbanUser(user._id)
                      : adminService.banUser(user._id));
                    toast.success(user.isBanned ? "User unbanned." : "User banned.");
                    await loadDashboard();
                  }}
                  variant={user.isBanned ? "ghost" : "danger"}
                >
                  {user.isBanned ? "Unban" : "Ban"}
                </Button>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[32px] border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-semibold text-white">Items</h2>
          <div className="mt-5 space-y-4">
            {dashboard.items.map((item) => (
              <div
                key={item._id}
                className="flex flex-col gap-3 rounded-[24px] bg-slate-950/60 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-semibold text-white">{item.title}</p>
                  <p className="text-sm text-slate-400">
                    {item.reportedBy?.name} • {item.status}
                  </p>
                </div>
                <Button
                  onClick={async () => {
                    await adminService.deleteItem(item._id);
                    toast.success("Item deleted.");
                    await loadDashboard();
                  }}
                  variant="danger"
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminPanel;
