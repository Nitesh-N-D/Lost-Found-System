import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { dashboardService } from "../../services/dashboardService";
import { usePageMeta } from "../../hooks/usePageMeta";
import StatCard from "../../components/dashboard/StatCard";
import StatusBadge from "../../components/common/StatusBadge";
import PageLoader from "../../components/common/PageLoader";

function DashboardOverview() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  usePageMeta({
    title: "Dashboard | Lost & Found",
    description: "Track your items, claims, notifications, and recovery progress from one premium dashboard.",
  });

  useEffect(() => {
    let active = true;

    dashboardService
      .getOverview()
      .then((data) => {
        if (active) setDashboard(data);
      })
      .catch((error) => toast.error(error.message))
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (loading) return <PageLoader label="Loading dashboard..." />;
  if (!dashboard) return null;

  const overview = dashboard?.overview ?? {
    totalItems: 0,
    openItems: 0,
    recoveredItems: 0,
    totalClaimsMade: 0,
    totalClaimsReceived: 0,
    activeUsers: 0,
  };
  const myClaims = Array.isArray(dashboard?.myClaims) ? dashboard.myClaims : [];
  const notifications = Array.isArray(dashboard?.notifications)
    ? dashboard.notifications
    : [];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
          Dashboard
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">Your recovery workspace</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
          Track activity, recent claims, and notifications through a calmer operational view.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <StatCard hint="Items you have reported" label="Total items" value={overview.totalItems} />
        <StatCard hint="Claims submitted by you" label="Claims made" value={overview.totalClaimsMade} />
        <StatCard hint="Community growth" label="Active users" value={overview.activeUsers} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-[32px] border border-white/8 bg-white/[0.03] p-6 md:p-7">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Recent claims</h2>
            <Link className="text-sm text-slate-300 hover:text-white" to="/dashboard/claims">
              View all
            </Link>
          </div>
          <div className="mt-5 space-y-4">
            {myClaims.map((claim) => (
              <div key={claim._id} className="rounded-[24px] border border-white/6 bg-slate-950/50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">{claim.item?.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{claim.message}</p>
                  </div>
                  <StatusBadge status={claim.status} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[32px] border border-white/8 bg-white/[0.03] p-6 md:p-7">
          <h2 className="text-xl font-semibold text-white">Notifications</h2>
          <div className="mt-5 space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="rounded-[24px] border border-white/6 bg-slate-950/50 p-4">
                <p className="font-semibold text-white">{notification.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">{notification.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default DashboardOverview;
