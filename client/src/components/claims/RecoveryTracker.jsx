import { useEffect, useState } from "react";
import Button from "../common/Button";

const statusOptions = [
  { value: "not_started", label: "Not started" },
  { value: "handoff_arranged", label: "Handoff arranged" },
  { value: "recovered", label: "Recovered" },
  { value: "disputed", label: "Disputed" },
];

const statusLabel = (status) => statusOptions.find((option) => option.value === status)?.label || "Not started";

function RecoveryTracker({ claim, onSave }) {
  const [status, setStatus] = useState(claim.recoveryStatus || "not_started");
  const [note, setNote] = useState(claim.recoveryNote || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setStatus(claim.recoveryStatus || "not_started");
    setNote(claim.recoveryNote || "");
  }, [claim._id, claim.recoveryStatus, claim.recoveryNote]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const updated = await onSave(claim._id, { status, note });
      if (updated) {
        setStatus(updated.recoveryStatus || status);
        setNote(updated.recoveryNote || "");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mt-5 rounded-2xl border border-stone-200 bg-stone-50 p-4">
      <h3 className="font-semibold text-stone-900">Recovery progress</h3>
      <p className="mt-1 text-xs leading-5 text-stone-600">
        Only the claimant and item owner can see this progress and its notes.
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <label className="text-sm font-medium text-stone-700">
          Status
          <select
            className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm"
            onChange={(event) => setStatus(event.target.value)}
            value={status}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium text-stone-700">
          Private note for the other participant
          <textarea
            className="mt-1 min-h-20 w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm"
            maxLength={500}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Add handoff details or explain a problem (avoid passwords or sensitive identity data)."
            value={note}
          />
        </label>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-stone-500">
          Current status: <span className="font-semibold text-stone-700">{statusLabel(claim.recoveryStatus || "not_started")}</span>
        </p>
        <Button disabled={saving} onClick={handleSave} variant="secondary">
          {saving ? "Saving..." : "Update progress"}
        </Button>
      </div>
      {claim.recoveryHistory?.length ? (
        <div className="mt-4 border-t border-stone-200 pt-3">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-stone-500">Recent history</h4>
          <ol className="mt-2 space-y-2">
            {[...claim.recoveryHistory].slice(-5).reverse().map((entry, index) => (
              <li className="text-xs leading-5 text-stone-600" key={entry.changedAt + "-" + index}>
                <span className="font-semibold text-stone-800">{statusLabel(entry.status)}</span>
                {" · "}{entry.changedBy?.name || "A participant"}
                {" · "}{entry.changedAt ? new Date(entry.changedAt).toLocaleString() : ""}
                {entry.note ? <span className="block whitespace-pre-wrap">{entry.note}</span> : null}
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </section>
  );
}

export default RecoveryTracker;
