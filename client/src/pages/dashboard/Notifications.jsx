import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { notificationService } from "../../services/notificationService";
import { usePageMeta } from "../../hooks/usePageMeta";
import PageLoader from "../../components/common/PageLoader";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  usePageMeta({
    title: "Notifications | Lost & Found",
    description: "Review possible matches for your lost and found reports.",
  });

  const loadNotifications = useCallback(async () => {
    try {
      const result = await notificationService.list({ limit: 50 });
      setNotifications(Array.isArray(result?.notifications) ? result.notifications : []);
      setUnreadCount(Number(result?.unreadCount) || 0);
    } catch (error) {
      toast.error(error.message || "Notifications could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadNotifications(); }, [loadNotifications]);

  const markRead = async (notificationId) => {
    try {
      await notificationService.markRead(notificationId);
      setNotifications((current) => current.map((notification) =>
        notification._id === notificationId
          ? { ...notification, readAt: notification.readAt || new Date().toISOString() }
          : notification
      ));
      setUnreadCount((count) => Math.max(0, count - 1));
    } catch (error) {
      toast.error(error.message || "This notification could not be updated.");
    }
  };

  const markAllRead = async () => {
    if (!unreadCount || busy) return;
    try {
      setBusy(true);
      await notificationService.markAllRead();
      const now = new Date().toISOString();
      setNotifications((current) => current.map((notification) => ({ ...notification, readAt: notification.readAt || now })));
      setUnreadCount(0);
      toast.success("All notifications marked as read.");
    } catch (error) {
      toast.error(error.message || "Notifications could not be updated.");
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <PageLoader label="Loading notifications..." />;

  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow text-xs font-semibold uppercase tracking-[0.3em]">Your inbox</p>
          <h1 className="mt-3 text-3xl font-semibold text-stone-900">Notifications</h1>
          <p className="mt-3 text-sm leading-7 text-stone-600">
            Possible matches are suggestions, not proof of ownership. Verify distinctive details before arranging a handoff.
          </p>
          <p className="mt-2 text-sm font-medium text-emerald-900">{unreadCount} unread</p>
        </div>
        <Button disabled={!unreadCount || busy} onClick={markAllRead} variant="secondary">
          {busy ? "Updating..." : "Mark all as read"}
        </Button>
      </div>

      {notifications.length ? (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <article className={"rounded-2xl border p-5 " + (notification.readAt ? "border-stone-200 bg-white" : "border-emerald-200 bg-emerald-50/60")} key={notification._id}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold text-stone-900">{notification.title}</h2>
                    {!notification.readAt && <span className="rounded-full bg-emerald-800 px-2.5 py-1 text-xs font-medium text-white">New</span>}
                    {notification.matchScore > 0 && <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-700">{notification.matchScore}% match</span>}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{notification.message}</p>
                  <p className="mt-2 text-xs text-stone-500">{new Date(notification.createdAt).toLocaleString()}</p>
                  {notification.matchedItem?._id && notification.matchedItem.status === "open" && (
                    <Link className="mt-4 inline-flex text-sm font-semibold text-emerald-900 underline underline-offset-4" onClick={() => !notification.readAt && markRead(notification._id)} to={"/items/" + notification.matchedItem._id}>
                      View possible match
                    </Link>
                  )}
                </div>
                {!notification.readAt && (
                  <Button onClick={() => markRead(notification._id)} variant="secondary">Mark read</Button>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState title="No match notifications yet" description="When a new lost or found report looks similar to one of yours, you will see the suggestion here." />
      )}
    </div>
  );
}

export default Notifications;
