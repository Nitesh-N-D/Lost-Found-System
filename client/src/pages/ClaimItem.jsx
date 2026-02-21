import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../services/api";

function ClaimItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post(`/claims/${id}`, { message });
      alert("Claim submitted successfully!");
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Error submitting claim");
    }
  };

  return (
  <div className="max-w-xl mx-auto mt-10 bg-white shadow-lg p-8 rounded-xl">
    <h2 className="text-2xl font-bold mb-6">Create Item</h2>

    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="title"
        placeholder="Title"
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />

      <textarea
        name="description"
        placeholder="Description"
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />

      <input
        name="category"
        placeholder="Category"
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />

      <select
        name="type"
        onChange={handleChange}
        className="w-full p-2 border rounded"
      >
        <option value="lost">Lost</option>
        <option value="found">Found</option>
      </select>

      <input
        name="location"
        placeholder="Location"
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />

      <input
        type="date"
        name="date"
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="w-full"
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Create Item
      </button>
    </form>
  </div>
);
}

export default ClaimItem;