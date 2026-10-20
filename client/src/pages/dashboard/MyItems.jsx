import { useEffect, useState } from "react";
import Button from "../../components/common/Button";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { itemService } from "../../services/itemService";
import ItemCard from "../../components/items/ItemCard";
import EmptyState from "../../components/common/EmptyState";

function MyItems() {
  const [data, setData] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [matchesByItem, setMatchesByItem] = useState({});
  const [feedbackByMatch, setFeedbackByMatch] = useState({});
  const [feedbackBusy, setFeedbackBusy] = useState("");

  useEffect(() => {
    itemService
      .listMine()
      .then(async (items) => {
        const reports = Array.isArray(items) ? items : [];
        setData({ items: reports });
        const openReports = reports.filter((item) => item.status === "open").slice(0, 5);
        const matches = await Promise.all(openReports.map(async (item) => {
          try {
            return [item._id, await itemService.getMatches(item._id)];
          } catch {
            return [item._id, []];
          }
        }));
        setMatchesByItem(Object.fromEntries(matches));
      })
      .catch((error) => { setLoadError(true); toast.error(error.message); })
      .finally(() => setLoading(false));
  }, []);

  const submitFeedback = async (itemId, matchedItemId, feedback) => {
    const key = itemId + ":" + matchedItemId;
    try {
      setFeedbackBusy(key);
      await itemService.submitMatchFeedback(itemId, matchedItemId, feedback);
      setFeedbackByMatch((current) => ({ ...current, [key]: feedback }));
      toast.success("Thanks — your feedback will help improve match suggestions.");
    } catch (error) {
      toast.error(error.message || "Feedback could not be saved.");
    } finally {
      setFeedbackBusy("");
    }
  };

  if (loading) return <p className="text-sm text-stone-500">Loading your reports...</p>;
  if (loadError) return <p className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800">Your reports could not be loaded. Refresh the page to try again.</p>;

  return data.items.length === 0 ? (
    <EmptyState
      description="Add a lost or found report to start your recovery workflow."
      title="No items yet"
    />
  ) : (
    <div className="grid gap-6 md:grid-cols-2">
      {data.items.map((item) => (
        <div className="space-y-3" key={item._id}>
          <ItemCard item={item} />
          {matchesByItem[item._id]?.length ? (
            <section className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
              <h2 className="font-semibold text-stone-900">Possible matches</h2>
              <p className="mt-1 text-xs leading-5 text-stone-600">Suggestions use report details and are not proof of ownership.</p>
              <div className="mt-3 space-y-2">
                {matchesByItem[item._id].map((match) => (
                  <Link className="flex items-center justify-between gap-3 rounded-xl border border-emerald-100 bg-white p-3 transition hover:border-emerald-400" key={match.item._id} to={"/items/" + match.item._id}>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-stone-900">{match.item.title}</span>
                      <span className="mt-1 block truncate text-xs text-stone-500">{match.item.location} · {match.item.type}</span>
                    </span>
                    <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-900">{match.score}%</span>
                  </Link>
                ))}
              </div>
              <div className="mt-3 space-y-2">
                {matchesByItem[item._id].map((match) => {
                  const key = item._id + ":" + match.item._id;
                  const selectedFeedback = feedbackByMatch[key];
                  return (
                    <div className="flex flex-wrap items-center justify-between gap-2" key={key}>
                      <span className="text-xs text-stone-600">
                        {selectedFeedback ? "Feedback saved: " + (selectedFeedback === "helpful" ? "helpful" : "not a match") : "Was this suggestion useful?"}
                      </span>
                      <div className="flex gap-2">
                        <Button className="px-3 py-2 text-xs" disabled={feedbackBusy === key} onClick={() => submitFeedback(item._id, match.item._id, "helpful")} variant={selectedFeedback === "helpful" ? "primary" : "secondary"}>Helpful</Button>
                        <Button className="px-3 py-2 text-xs" disabled={feedbackBusy === key} onClick={() => submitFeedback(item._id, match.item._id, "not_helpful")} variant={selectedFeedback === "not_helpful" ? "primary" : "secondary"}>Not a match</Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export default MyItems;
