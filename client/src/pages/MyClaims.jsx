import { useEffect, useState } from "react";
import API from "../services/api";
import StatusBadge from "../components/StatusBadge";

function MyClaims() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/claims/my-claims");
      setClaims(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h2 className="text-3xl font-bold mb-8">My Claims</h2>

      {/* Loading State */}
      {loading && (
        <div className="text-center text-gray-500 py-10">
          Loading your claims...
        </div>
      )}

      {/* Empty State */}
      {!loading && claims.length === 0 && (
        <div className="text-center text-gray-400 py-16">
          You haven’t submitted any claims yet.
        </div>
      )}

      {/* Claims List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {!loading &&
          claims.map((claim) => (
            <div
              key={claim._id}
              className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition"
            >
              <h3 className="text-lg font-semibold mb-2">
                {claim.item?.title}
              </h3>

              <p className="text-sm text-gray-600 mb-4">
                {claim.message}
              </p>

              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  Submitted Claim
                </span>

                <StatusBadge status={claim.status} />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default MyClaims;