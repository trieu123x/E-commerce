"use client";
import { useEffect, useState } from "react";
import instance from "../../api/axios";
import { Eye, Trash2, Star } from "lucide-react";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);

  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
    console.log(reviews)
  useEffect(() => {
    fetchReviews();
  }, [page, ratingFilter]);

  const fetchReviews = async () => {
    try {
      setLoading(true);

      const res = await instance.get("/admin/reviews", {
        params: {
          page,
          limit,
          search: search || undefined,
          rating: ratingFilter || undefined,
        },
      });

      if (res.data.success) {
        setReviews(res.data.data);
        setTotal(res.data.pagination.total);
      }
    } catch (err) {
      console.error("Fetch reviews error:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (id) => {
    if (!confirm("Bạn chắc chắn muốn xóa review này?")) return;

    try {
      await instance.delete(`/admin/reviews/${id}`);
      fetchReviews();
    } catch (err) {
      console.error("Delete review error:", err);
    }
  };

  const totalPages = Math.ceil(total / limit);

  if (loading && reviews.length === 0) {
    return <div className="text-center py-10">Đang tải...</div>;
  }

  return (
    <div>

      <h1 className="text-3xl font-bold mb-6">Quản Lý Reviews</h1>

      {/* SEARCH + FILTER */}

      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Tìm theo sản phẩm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-64"
        />

        <button
          onClick={() => {
            setPage(1);
            fetchReviews();
          }}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Tìm
        </button>

        <select
          value={ratingFilter}
          onChange={(e) => {
            setRatingFilter(e.target.value);
            setPage(1);
          }}
          className="border px-3 py-2 rounded"
        >
          <option value="">Tất cả rating</option>
          <option value="5">5 sao</option>
          <option value="4">4 sao</option>
          <option value="3">3 sao</option>
          <option value="2">2 sao</option>
          <option value="1">1 sao</option>
        </select>
      </div>

      {/* TABLE */}

      <div className="bg-white shadow rounded-lg overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">Sản Phẩm</th>
              <th className="px-6 py-3 text-left">Người Dùng</th>
              <th className="px-6 py-3 text-left">Rating</th>
              <th className="px-6 py-3 text-left">Comment</th>
              <th className="px-6 py-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>

            {reviews.map((review) => (

              <tr key={review.id} className="border-t hover:bg-gray-50">

                <td className="px-6 py-3">#{review.id}</td>

                <td className="px-6 py-3 flex items-center gap-2">

                  <img
                    src={review.product?.images?.[0]?.image_url}
                    className="w-10 h-10 object-cover rounded"
                  />

                  {review.product?.name}

                </td>

                <td className="px-6 py-3">
                  {review.user?.full_name}
                </td>

                <td className="px-6 py-3 flex gap-1">

                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-500 fill-yellow-500" />
                  ))}

                </td>

                <td className="px-6 py-3 max-w-xs truncate">
                  {review.comment}
                </td>

                <td className="px-6 py-3 flex gap-2">

                  <button
                    onClick={() => setSelectedReview(review)}
                    className="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1"
                  >
                    <Eye size={16} />
                  </button>

                  <button
                    onClick={() => deleteReview(review.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1"
                  >
                    <Trash2 size={16} />
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* PAGINATION */}

      <div className="flex justify-center gap-2 mt-6">

        {Array.from({ length: totalPages }).map((_, i) => (

          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded ${
              page === i + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>

        ))}

      </div>

      {/* REVIEW DETAIL MODAL */}

      {selectedReview && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

          <div className="bg-white p-6 rounded-lg w-full max-w-lg">

            <h2 className="text-xl font-bold mb-4">
              Review #{selectedReview.id}
            </h2>

            <p className="mb-2">
              <b>Product:</b> {selectedReview.product?.name}
            </p>

            <p className="mb-2">
              <b>User:</b> {selectedReview.user?.full_name}
            </p>

            <p className="mb-2">
              <b>Rating:</b> {selectedReview.rating} ⭐
            </p>

            <p className="mb-4">
              <b>Comment:</b> {selectedReview.comment}
            </p>

            <div className="flex justify-end">

              <button
                onClick={() => setSelectedReview(null)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Đóng
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}