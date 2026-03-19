"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import instance from "../api/axios";

export default function OrdersPage() {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [openOrder, setOpenOrder] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const toggleOrder = (id) => {
    setOpenOrder(openOrder === id ? null : id);
  };

  const fetchOrders = async () => {
    try {
      const res = await instance.get("/order/your-order", {
        params: { page, limit: 5 }
      });

      let data = res.data.data;

      if (statusFilter !== "ALL") {
        data = data.filter((o) => o.status === statusFilter);
      }

      setOrders(data);
      setTotalPages(res.data.pagination.total_pages);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user) fetchOrders();
  }, [user, page, statusFilter]);

  return (
    <div className="min-h-screen bg-orange-50 p-10">
      <div className="max-w-5xl mx-auto">

        {/* Title */}
        <h1 className="text-3xl font-bold text-orange-500 mb-6">
          My Orders
        </h1>

        {/* Filter */}
        <div className="flex gap-3 mb-6">
          {["ALL", "PENDING", "COMPLETED", "CANCELLED"].map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                statusFilter === status
                  ? "bg-orange-500 text-white"
                  : "bg-white border hover:bg-orange-100"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Orders */}
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition"
            >
              {/* Header */}
              <div
                className="flex justify-between items-center p-6 cursor-pointer"
                onClick={() => toggleOrder(order.id)}
              >
                <div>
                  <p className="text-sm text-gray-400">
                    Order #{order.id}
                  </p>

                  <p className="font-semibold">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-orange-500">
                    {Number(order.total_amount).toLocaleString()} đ
                  </p>

                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                      order.status === "COMPLETED"
                        ? "bg-green-100 text-green-600"
                        : order.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Animated Content */}
              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  openOrder === order.id
                    ? "max-h-[600px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="border-t px-6 pb-6">

                  {/* Shipping Address */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <p className="text-sm font-semibold text-gray-600 mb-1">
                      Shipping Address
                    </p>

                    <p className="text-sm text-gray-700">
                      {order.shipping_address || "No address"}
                    </p>
                  </div>

                  {/* Items */}
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center py-4 border-b last:border-none"
                    >
                      {/* Product */}
                      <div className="flex items-center gap-4">
                        <img
                          src={
                            item.product?.images?.[0]?.image_url ||
                            "/no-image.png"
                          }
                          alt={item.product?.name}
                          className="w-16 h-16 object-cover rounded-lg border"
                        />

                        <div>
                          <p className="font-semibold">
                            {item.product?.name}
                          </p>

                          <p className="text-sm text-gray-400">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="font-semibold text-orange-500">
                          {Number(item.price).toLocaleString()} đ
                        </p>

                        <p className="text-sm text-gray-400 mb-2">
                          Total: {Number(item.total).toLocaleString()} đ
                        </p>

                        {order.status === "COMPLETED" && (
                          <button className="px-3 py-1 text-xs bg-orange-500 text-white rounded hover:bg-orange-600 transition">
                            Review
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-3 mt-8">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-white border rounded disabled:opacity-40"
          >
            Prev
          </button>

          <span className="px-4 py-2 font-semibold">
            {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-white border rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>

      </div>
    </div>
  );
}