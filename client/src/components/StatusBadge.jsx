function StatusBadge({ status }) {
  const styles = {
    open: "bg-green-100 text-green-600",
    claimed: "bg-yellow-100 text-yellow-600",
    closed: "bg-gray-200 text-gray-600",
    pending: "bg-blue-100 text-blue-600",
    approved: "bg-green-100 text-green-600",
    rejected: "bg-red-100 text-red-600",
  };

  return (
    <span
      className={`text-xs px-3 py-1 rounded-full font-medium ${
        styles[status] || "bg-gray-200 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

export default StatusBadge;