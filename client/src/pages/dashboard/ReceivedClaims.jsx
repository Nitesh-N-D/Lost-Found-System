import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { claimService } from "../../services/claimService";
import StatusBadge from "../../components/common/StatusBadge";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";

function ReceivedClaims() {
  const [claims, setClaims] = useState([]);
  const [selection, setSelection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const loadClaims = async () => {
    try {
      setClaims(await claimService.getReceived());
      setLoadError(false);
    } catch (error) {
      setLoadError(true);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    claimService
      .getReceived()
      .then((data) => {
        if (active) setClaims(data);
      })
      .catch((error) => { if (active) { setLoadError(true); toast.error(error.message); } })
      .finally(() => { if (active) setLoading(false); });

    return () => {
      active = false;
    };
  }, []);

  const updateStatus = async () => {
    if (!selection) return;
    try {
      await claimService.updateStatus(selection.claim._id, {
        status: selection.status,
      });
      toast.success(`Claim ${selection.status}.`);
      setSelection(null);
      await loadClaims();
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) return <p className="text-sm text-stone-500">Loading received claims...</p>;
  if (loadError && claims.length === 0) return <p className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800">Received claims could not be loaded. Refresh the page to try again.</p>;
  if (claims.length === 0) return <p className="text-sm text-stone-500">No claims have been received yet.</p>;

  return (
    <div className="space-y-4">
      {claims.map((claim) => (
        <div key={claim._id} className="rounded-[28px] border border-stone-200 bg-white p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xl font-semibold text-stone-900">{claim.item?.title}</p>
              <p className="mt-2 text-sm text-stone-600">Claimant: {claim.claimant?.name}</p>
              <p className="mt-2 text-sm leading-6 text-stone-500">{claim.message}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={claim.status} />
              <Link to={`/dashboard/chat/${claim._id}`}>
                <Button variant="secondary">Chat</Button>
              </Link>
              {claim.status === "pending" ? (
                <>
                  <Button onClick={() => setSelection({ claim, status: "approved" })}>Approve</Button>
                  <Button onClick={() => setSelection({ claim, status: "rejected" })} variant="danger">
                    Reject
                  </Button>
                </>
              ) : null}
            </div>
          </div>
        </div>
      ))}

      <Modal open={Boolean(selection)} onClose={() => setSelection(null)} title="Confirm claim update">
        <p className="text-sm text-stone-600">
          This will mark the claim as <span className="capitalize">{selection?.status}</span>.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button onClick={() => setSelection(null)} variant="secondary">
            Cancel
          </Button>
          <Button onClick={updateStatus}>Confirm</Button>
        </div>
      </Modal>
    </div>
  );
}

export default ReceivedClaims;
