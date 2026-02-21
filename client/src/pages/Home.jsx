import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";

function Home() {
  const [items, setItems] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchItems = async () => {
    try {
        setLoading(true);
      const { data } = await API.get(
        `/items?keyword=${keyword}&page=${page}&limit=4`
      );
      setItems(data.items);
      setPages(data.pages);
        setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [keyword, page]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Lost & Found Items</h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Search items..."
        value={keyword}
        onChange={(e) => {
          setKeyword(e.target.value);
          setPage(1);
        }}
        className="w-full md:w-1/3 p-2 border rounded mb-6"
      />
{loading && (
  <div className="text-center py-10 text-gray-500">
    Loading items...
  </div>
)}
      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <div
            key={item._id}
            className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl transition"
          >
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={item.title}
                className="h-48 w-full object-cover"
              />
            )}

            <div className="p-4">
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="text-sm text-gray-600 mb-2">
                {item.description}
              </p>

              {/* Updated Status Section */}
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                  {item.type}
                </span>

                <StatusBadge status={item.status} />
              </div>

              {item.status === "open" && (
                <button
  disabled={item.status !== "open"}
  className={`w-full py-2 rounded transition ${
    item.status === "open"
      ? "bg-blue-600 text-white hover:bg-blue-700"
      : "bg-gray-300 text-gray-500 cursor-not-allowed"
  }`}
>
  {item.status === "open" ? "Claim Item" : "Not Available"}
</button>
              )}
            </div>
          </div>
        ))}
      </div>
{!loading && items.length === 0 && (
  <div className="text-center py-20 text-gray-400">
    No items found.
  </div>
)}
      {/* Pagination */}
      <div className="mt-8 flex justify-center space-x-2">
        {Array.from({ length: pages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-4 py-2 rounded ${
              page === i + 1
                ? "bg-black text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Home;