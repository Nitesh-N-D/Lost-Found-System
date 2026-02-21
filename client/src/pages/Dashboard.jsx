import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Dashboard() {
  const { user, logout } = useContext(AuthContext);
return (
  <div className="max-w-5xl mx-auto p-8">
    <h2 className="text-3xl font-bold mb-8">Dashboard</h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white shadow p-6 rounded-xl">
        <h3 className="text-gray-500 text-sm">Logged in as</h3>
        <p className="text-xl font-semibold">{user?.name}</p>
      </div>

      <div className="bg-white shadow p-6 rounded-xl">
        <h3 className="text-gray-500 text-sm">Email</h3>
        <p className="text-xl font-semibold">{user?.email}</p>
      </div>

      <div className="bg-white shadow p-6 rounded-xl flex items-center justify-center">
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
);
}

export default Dashboard;