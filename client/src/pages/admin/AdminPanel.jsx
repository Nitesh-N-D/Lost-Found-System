import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminService } from "../../services/adminService";
import Button from "../../components/common/Button";

function AdminPanel() {
  const [dashboard, setDashboard] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [deletingItemId, setDeletingItemId] = useState(null);

  const loadDashboard = async () => {
    try {
      setDashboard(await adminService.getDashboard());
      setLoadError(false);
    } catch (error) {
      setLoadError(true);
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
      .catch((error) => { if (active) { setLoadError(true); toast.error(error.message); } });

    return () => {
      active = false;
    };
  }, []);

  if (!dashboard) return loadError ? <p className="mx-auto max-w-7xl rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800">Admin data could not be loaded. Refresh the page to try again.</p> : null;

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
      <div className="grid gap-6 lg:grid-cols-3">
        {[
          ["Total users", dashboard.stats?.totalUsers ?? 0],
          ["Total items", dashboard.stats?.totalItems ?? 0],
          ["Active claims", dashboard.stats?.activeClaims ?? 0],
        ].map(([label, value]) => (
          <div key={label} className="rounded-[28px] border border-stone-200 bg-white p-6">
            <p className="text-sm text-stone-500">{label}</p>
            <p className="mt-4 text-4xl font-semibold text-stone-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <section className="rounded-[32px] border border-stone-200 bg-white p-6">
          <h2 className="text-2xl font-semibold text-stone-900">Users</h2>
          <div className="mt-5 space-y-4">
            {(dashboard.users || []).map((user) => (
              <div
                key={user._id}
                className="flex flex-col gap-3 rounded-[24px] bg-stone-50 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-semibold text-stone-900">{user.name}</p>
                  <p className="text-sm text-stone-500">{user.email}</p>
                </div>
                <Button
                  disabled={updatingUserId === user._id}
                  onClick={async () => {
                    try {
                      setUpdatingUserId(user._id);
                      await (user.isBanned
                        ? adminService.unbanUser(user._id)
                        : adminService.banUser(user._id));
                      toast.success(user.isBanned ? "User unbanned." : "User banned.");
                      await loadDashboard();
                    } catch (error) {
                      toast.error(error.message);
                    } finally {
                      setUpdatingUserId(null);
                    }
                  }}
                  variant={user.isBanned ? "ghost" : "danger"}
                >
                  {updatingUserId === user._id ? "Updating..." : user.isBanned ? "Unban" : "Ban"}
                </Button>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[32px] border border-stone-200 bg-white p-6">
          <h2 className="text-2xl font-semibold text-stone-900">Items</h2>
          <div className="mt-5 space-y-4">
            {(dashboard.items || []).map((item) => (
              <div
                key={item._id}
                className="flex flex-col gap-3 rounded-[24px] bg-stone-50 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-semibold text-stone-900">{item.title}</p>
                  <p className="text-sm text-stone-500">
                    {item.reportedBy?.name} • {item.status}
                  </p>
                </div>
                <Button
                  disabled={deletingItemId === item._id}
                  onClick={async () => {
                    try {
                      setDeletingItemId(item._id);
                      await adminService.deleteItem(item._id);
                      toast.success("Item deleted.");
                      await loadDashboard();
                    } catch (error) {
                      toast.error(error.message);
                    } finally {
                      setDeletingItemId(null);
                    }
                  }}
                  variant="danger"
                >
                  {deletingItemId === item._id ? "Deleting..." : "Delete"}
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
