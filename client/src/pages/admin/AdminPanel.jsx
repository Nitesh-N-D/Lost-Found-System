import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminService } from "../../services/adminService";
import Button from "../../components/common/Button";
import StatusBadge from "../../components/common/StatusBadge";

const reportReasonLabels = {
  incorrect_information: "Incorrect information",
  possible_scam: "Possible scam or misleading listing",
  inappropriate_content: "Inappropriate content",
  duplicate_listing: "Duplicate listing",
  other: "Other",
};

function AdminPanel() {
  const [dashboard, setDashboard] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [deletingItemId, setDeletingItemId] = useState(null);
  const [updatingReportId, setUpdatingReportId] = useState(null);

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

  const updateReport = async (reportId, status) => {
    try {
      setUpdatingReportId(reportId);
      await adminService.updateReportStatus(reportId, status);
      toast.success(status === "reviewed" ? "Report marked as reviewed." : "Report dismissed.");
      await loadDashboard();
    } catch (error) {
      toast.error(error.message || "Could not update this report.");
    } finally {
      setUpdatingReportId(null);
    }
  };

  if (!dashboard) return loadError ? <p className="mx-auto max-w-7xl rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800">Admin data could not be loaded. Refresh the page to try again.</p> : null;

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Total users", dashboard.stats?.totalUsers ?? 0],
          ["Total items", dashboard.stats?.totalItems ?? 0],
          ["Active claims", dashboard.stats?.activeClaims ?? 0],
          ["Open reports", dashboard.stats?.openReports ?? 0],
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
              <div key={user._id} className="flex flex-col gap-3 rounded-[24px] bg-stone-50 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-stone-900">{user.name}</p>
                  <p className="text-sm text-stone-500">{user.email}</p>
                  {user.role === "admin" ? <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-emerald-800">Administrator</p> : null}
                </div>
                <Button
                  disabled={updatingUserId === user._id || user.role === "admin"}
                  onClick={async () => {
                    try {
                      setUpdatingUserId(user._id);
                      await (user.isBanned ? adminService.unbanUser(user._id) : adminService.banUser(user._id));
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
                  {updatingUserId === user._id ? "Updating..." : user.isBanned ? "Unban" : user.role === "admin" ? "Admin protected" : "Ban"}
                </Button>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[32px] border border-stone-200 bg-white p-6">
          <h2 className="text-2xl font-semibold text-stone-900">Items</h2>
          <div className="mt-5 space-y-4">
            {(dashboard.items || []).map((item) => (
              <div key={item._id} className="flex flex-col gap-3 rounded-[24px] bg-stone-50 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-stone-900">{item.title}</p>
                  <p className="text-sm text-stone-500">{item.reportedBy?.name} • {item.status}</p>
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

      <section className="mt-8 rounded-[32px] border border-stone-200 bg-white p-6 sm:p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-stone-900">Listing reports</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">Review user-submitted reports about suspicious, duplicate, or incorrect listings.</p>
          </div>
          <p className="text-sm text-stone-500">{(dashboard.itemReports || []).filter((report) => report.status === "open").length} awaiting review</p>
        </div>
        <div className="mt-5 space-y-4">
          {(dashboard.itemReports || []).length === 0 ? (
            <p className="rounded-2xl bg-stone-50 p-5 text-sm text-stone-600">No listing reports have been submitted.</p>
          ) : (dashboard.itemReports || []).map((report) => (
            <article key={report._id} className="rounded-[24px] border border-stone-200 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-semibold text-stone-900">{report.item?.title || "Listing no longer available"}</p>
                  <p className="mt-1 text-xs text-stone-500">
                    Reported by {report.reportedBy?.name || "Unknown user"}{report.reportedBy?.email ? ` (${report.reportedBy.email})` : ""} · {report.createdAt ? new Date(report.createdAt).toLocaleString() : ""}
                  </p>
                  <p className="mt-3 text-sm font-medium text-stone-700">{reportReasonLabels[report.reason] || "Other"}</p>
                  {report.details ? <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-stone-600">{report.details}</p> : <p className="mt-2 text-sm italic text-stone-500">No additional details supplied.</p>}
                </div>
                <StatusBadge status={report.status} />
              </div>
              {report.status === "open" ? (
                <div className="mt-4 flex flex-wrap justify-end gap-3">
                  <Button disabled={updatingReportId === report._id} onClick={() => updateReport(report._id, "dismissed")} variant="secondary">
                    {updatingReportId === report._id ? "Updating..." : "Dismiss"}
                  </Button>
                  <Button disabled={updatingReportId === report._id} onClick={() => updateReport(report._id, "reviewed")}>
                    {updatingReportId === report._id ? "Updating..." : "Mark reviewed"}
                  </Button>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AdminPanel;
