import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

function CreateItem() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    type: "lost",
    location: "",
    date: "",
  });

  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    if (image) {
      formData.append("image", image);
    }

    try {
      await API.post("/items", formData);
      toast.success("Item created successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Error creating item");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white shadow-xl rounded-2xl p-8">
      <h2 className="text-2xl font-bold mb-6">Create Item</h2>

      <form onSubmit={handleSubmit} className="space-y-5">

        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            name="title"
            placeholder="Enter item title"
            onChange={handleChange}
            required
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            placeholder="Enter description"
            onChange={handleChange}
            required
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <input
            name="category"
            placeholder="Electronics, Keys, Wallet..."
            onChange={handleChange}
            required
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <select
            name="type"
            onChange={handleChange}
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            name="location"
            placeholder="Enter location"
            onChange={handleChange}
            required
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            name="date"
            onChange={handleChange}
            required
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

      <div>
  <label className="block text-sm font-medium mb-2">
    Upload Image
  </label>

  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">

    <div className="flex flex-col items-center justify-center pt-5 pb-6">
      <svg
        className="w-8 h-8 mb-3 text-gray-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7 16V4m0 0L3 8m4-4l4 4m6 8v-4m0 0l4 4m-4-4l-4 4"
        />
      </svg>

      <p className="text-sm text-gray-500">
        Click to upload or drag and drop
      </p>

      {image && (
  <img
    src={URL.createObjectURL(image)}
    alt="preview"
    className="mt-3 h-16 rounded-lg object-cover"
  />
)}
    </div>

    <input
      type="file"
      accept="image/*"
      onChange={handleImageChange}
      className="hidden"
    />
  </label>
</div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition duration-300 font-semibold"
        >
          Create Item
        </button>

      </form>
    </div>
  );
}

export default CreateItem;