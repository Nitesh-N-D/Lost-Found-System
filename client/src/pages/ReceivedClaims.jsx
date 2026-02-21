import { useEffect, useState } from "react";
import API from "../services/api";
import StatusBadge from "../components/StatusBadge";
import toast from "react-hot-toast";

function ReceivedClaims() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/claims/received");
      setClaims(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const confirmUpdate = (claim, status) => {
    setSelectedClaim(claim);
    setSelectedStatus(status);
    setModalOpen(true);
  };

  const handleConfirm = async () => {
    try {
      await API.put(`/claims/${selectedClaim._id}`, {
        status: selectedStatus,
      });

      toast.success(`Claim ${selectedStatus}`);
      setModalOpen(false);
      fetchClaims();
    } catch (error) {
      toast.error("Error updating claim");
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h2 className="text-3xl font-bold mb-8">
        Claims Received On My Items
      </h2>

      {/* Loading */}
      {loading && (
        <div className="text-center text-gray-500 py-10">
          Loading received claims...
        </div>
      )}

      {/* Empty State */}
      {!loading && claims.length === 0 && (
        <div className="text-center text-gray-400 py-16">
          No one has claimed your items yet.
        </div>
      )}

      {/* Claims Grid */}
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

              <p className="text-sm text-gray-500 mb-1">
                Claimed By:{" "}
                <span className="font-medium text-gray-700">
                  {claim.claimant?.name}
                </span>
              </p>

              <p className="text-sm text-gray-600 mb-4">
                {claim.message}
              </p>

              <div className="flex justify-between items-center mb-4">
                <span className="text-xs text-gray-400">
                  Claim Status
                </span>
                <StatusBadge status={claim.status} />
              </div>

              {claim.status === "pending" && (
                <div className="flex gap-3">
                  <button
                    onClick={() => confirmUpdate(claim, "approved")}
                    className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => confirmUpdate(claim, "rejected")}
                    className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
      </div>

      {/* Confirmation Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl p-8 w-96 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">
              Confirm Action
            </h3>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to{" "}
              <span className="font-semibold">
                {selectedStatus}
              </span>{" "}
              this claim?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirm}
                className={`px-4 py-2 text-white rounded-lg transition ${
                  selectedStatus === "approved"
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReceivedClaims;