import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { claimService } from "../../services/claimService";
import EmptyState from "../../components/common/EmptyState";
import StatusBadge from "../../components/common/StatusBadge";
import Button from "../../components/common/Button";

function MyClaims() {
  const [claims, setClaims] = useState([]);

  useEffect(() => {
    claimService
      .getMine()
      .then(setClaims)
      .catch((error) => toast.error(error.message));
  }, []);

  return claims.length === 0 ? (
    <EmptyState
      description="Once you claim an item, it will appear here with status updates and access to chat."
      title="No claims submitted yet"
    />
  ) : (
    <div className="space-y-4">
      {claims.map((claim) => (
        <div key={claim._id} className="rounded-[28px] border border-white/10 bg-white/5 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xl font-semibold text-white">{claim.item?.title}</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">{claim.message}</p>
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
