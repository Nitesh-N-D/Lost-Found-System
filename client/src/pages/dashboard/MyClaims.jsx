import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { claimService } from "../../services/claimService";
import EmptyState from "../../components/common/EmptyState";
import StatusBadge from "../../components/common/StatusBadge";
import Button from "../../components/common/Button";

function MyClaims() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    claimService
      .getMine()
      .then(setClaims)
      .catch((error) => { setLoadError(true); toast.error(error.message); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-stone-500">Loading your claims...</p>;
  if (loadError) return <p className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800">Your claims could not be loaded. Refresh the page to try again.</p>;

  return claims.length === 0 ? (
    <EmptyState
      description="Once you claim an item, it will appear here with status updates and access to chat."
      title="No claims submitted yet"
    />
  ) : (
    <div className="space-y-4">
      {claims.map((claim) => (
        <div key={claim._id} className="rounded-[28px] border border-stone-200 bg-white p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xl font-semibold text-stone-900">{claim.item?.title}</p>
              <p className="mt-2 text-sm leading-6 text-stone-600">{claim.message}</p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={claim.status} />
              <Link to={`/dashboard/chat/${claim._id}`}>
                <Button variant="secondary">Open chat</Button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MyClaims;
