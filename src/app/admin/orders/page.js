"use client";
import { useEffect, useState } from "react";
import instance from "../../api/axios";
import { Eye, Truck, Check } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [sort_by, setSortBy] = useState("created_at");
  const [sort_order, setSortOrder] = useState("DESC");
  const [filter, setFilter] = useState("ALL");
  const [orderIdSearch, setOrderIdSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  
  useEffect(() => {
    fetchOrders();
  }, [page, filter, sort_by, sort_order, orderIdSearch, startDate, endDate, minPrice, maxPrice]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await instance.get("/admin/orders", {
        params: {
          page,
          limit,
          status: filter === "ALL" ? undefined : filter,
          sort_by,
          sort_order,
          order_id: orderIdSearch || undefined,
          start_date: startDate || undefined,
          end_date: endDate || undefined,
          min_price: minPrice || undefined,
          max_price: maxPrice || undefined,
        },
      });
      if (res.data.success) {
        setOrders(res.data.data);
        setTotal(res.data.pagination?.total || res.data.data.length);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    setPage(1);
    fetchOrders();
  };

  const handleResetFilters = () => {
    setOrderIdSearch("");
    setStartDate("");
    setEndDate("");
    setMinPrice("");
    setMaxPrice("");
    setFilter("ALL");
    setPage(1);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await instance.patch(`/admin/orders/${orderId}`, {
        status: newStatus,
      });
      fetchOrders();
      setSelectedOrder(null);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      PENDING: "Chờ Xác Nhận",
      CONFIRMED: "Đã Xác Nhận",
      SHIPPED: "Đang Giao",
      DELIVERED: "Đã Giao",
      CANCELLED: "Đã Hủy",
      COMPLETED:"Đã xong"
    };
    return labels[status] || status;
  };

  const totalPages = Math.ceil(total / limit);

  if (loading && orders.length === 0) {
    return <div className="text-center py-10">Đang tải...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản Lý Đơn Hàng</h1>
      </div>
      
      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ID Đơn Hàng</label>
            <input
              type="text"
              placeholder="Nhập ID..."
              value={orderIdSearch}
              onChange={(e) => setOrderIdSearch(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Giá tối thiểu</label>
            <input
              type="number"
              placeholder="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Giá tối đa</label>
            <input
              type="number"
              placeholder="999..."
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-2 border-t">
          <div className="flex gap-2">
            {["ALL", "PENDING", "CANCELLED", "COMPLETED"].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setFilter(status);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  filter === status
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {status === "ALL" ? "Tất Cả" : getStatusLabel(status)}
              </button>
            ))}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition"
            >
              Đặt lại
            </button>
            <button
              onClick={handleApplyFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Lọc kết quả
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6 flex justify-end items-center gap-2">
        <div className="flex gap-2 items-center">
          <span className="text-sm font-semibold text-gray-600">Sắp xếp:</span>
          <select
            value={`${sort_by}-${sort_order}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split("-");
              setSortBy(field);
              setSortOrder(order);
            }}
            className="border rounded-lg px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="created_at-DESC">Mới nhất (Thời gian)</option>
            <option value="created_at-ASC">Cũ nhất (Thời gian)</option>
            <option value="id-DESC">ID (Giảm dần)</option>
            <option value="id-ASC">ID (Tăng dần)</option>
            <option value="total_amount-DESC">Giá tiền (Cao đến thấp)</option>
            <option value="total_amount-ASC">Giá tiền (Thấp đến cao)</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">ID Đơn</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Khách Hàng</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Tổng Tiền</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Trạng Thái</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Ngày Tạo</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-3 font-semibold">#{order.id}</td>
                <td className="px-6 py-3">{order.user?.full_name || "N/A"}</td>
                <td className="px-6 py-3 font-semibold">
                  ${parseFloat(order.total_amount).toFixed(2)}
                </td>
                <td className="px-6 py-3">
                  <div className="flex gap-2 items-center">
                    <span className={`px-2 py-1 rounded text-sm font-semibold ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                    { order.payment?.method && (
                      <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-600 font-medium">
                        {order.payment.method}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-3 text-sm">
                  {new Date(order.created_at).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-6 py-3">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-blue-700"
                  >
                    <Eye size={16} />
                    Chi Tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-center gap-2">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i + 1}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded ${
              page === i + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-196 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Chi Tiết Đơn Hàng #{selectedOrder.id}</h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-gray-600 text-sm">Khách Hàng</p>
                <p className="font-semibold">{selectedOrder.user?.full_name || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Email</p>
                <p className="font-semibold">{selectedOrder.user?.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Tổng Tiền</p>
                <p className="font-semibold text-lg">
                  ${parseFloat(selectedOrder.total_amount).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Ngày Tạo</p>
                <p className="font-semibold">
                  {new Date(selectedOrder.created_at).toLocaleDateString("vi-VN")}
                </p>
              </div>
            </div>
<div className="border-t pt-4 mb-6">
  <h3 className="font-semibold mb-3">Sản Phẩm</h3>

  <div className="space-y-3">
    {selectedOrder.items?.map((item) => (
      <div
        key={item.id}
        className="flex items-center gap-4 border rounded-lg p-3"
      >
        <img
          src={item.product?.images?.[0]?.image_url}
          alt={item.product?.name}
          className="w-16 h-16 object-cover rounded"
        />

        <div className="flex-1">
          <p className="font-semibold">{item.product?.name}</p>
          <p className="text-sm text-gray-500">
            Số lượng: {item.quantity}
          </p>
        </div>

        <div className="font-semibold">
          ${parseFloat(item.price).toFixed(2)}
        </div>
      </div>
    ))}
  </div>
</div>
            <div className="border-t pt-4 mb-6">
              <h3 className="font-semibold mb-3">Cập Nhật Trạng Thái</h3>
              <div className="flex gap-2 flex-wrap">
                {["PENDING",  "CANCELLED","COMPLETED"].map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => handleUpdateStatus(selectedOrder.id, status)}
                      disabled={selectedOrder.status === status}
                      className={`px-3 py-1 rounded text-sm font-semibold transition ${
                        selectedOrder.status === status
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      {getStatusLabel(status)}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
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
