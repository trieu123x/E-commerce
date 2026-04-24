"use client";

import { useEffect, useState } from "react";
import instance from "@/app/api/axios";
import { CreditCard, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = {
  COD: '#10b981',
  VNPAY: '#3b82f6',
  STRIPE: '#a855f7'
};

export default function PaymentPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPaymentStats();
  }, []);

  const fetchPaymentStats = async () => {
    try {
      setLoading(true);
      const res = await instance.get("/order/payment-statistics");
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching payment stats:", err);
      setError("Lỗi khi tải thống kê thanh toán");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500">Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500">Không có dữ liệu</div>
      </div>
    );
  }

  const chartData = stats.summary.paymentMethods;

  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <CreditCard size={32} className="text-red-500" />
          <h1 className="text-3xl font-bold">Thống Kê Thanh Toán</h1>
        </div>
        <p className="text-gray-600">Xem chi tiết các giao dịch thanh toán của bạn</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Orders */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Tổng Số Đơn</p>
              <p className="text-3xl font-bold text-blue-600">
                {stats.summary.totalOrders}
              </p>
            </div>
            <div className="text-5xl opacity-20">🛒</div>
          </div>
        </div>

        {/* Total Spent */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Tổng Chi Tiêu</p>
              <p className="text-3xl font-bold text-green-600">
                ${Number(stats.summary.totalSpent).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </p>
            </div>
            <div className="text-5xl opacity-20">💰</div>
          </div>
        </div>

        {/* Payment Methods Count */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Phương Thức Thanh Toán</p>
              <p className="text-3xl font-bold text-purple-600">
                {stats.summary.paymentMethods.length}
              </p>
            </div>
            <div className="text-5xl opacity-20">💳</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Bar Chart - Amount by Payment Method */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp size={20} />
            Số Tiền Theo Phương Thức
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="method" />
              <YAxis />
              <Tooltip
                formatter={(value) => `$${Number(value).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}`}
              />
              <Bar dataKey="spent" fill="#3b82f6" name="Số Tiền" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp size={20} />
            Tỷ Lệ Chi Tiêu
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ method, spent }) =>
                  `${method}: $${Number(spent).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="spent"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.method] || '#888888'} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => `$${Number(value).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Chi Tiết Theo Phương Thức Thanh Toán</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Phương Thức
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Số Lần Sử Dụng
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Tổng Chi Tiêu
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Trung Bình / Lần
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Lần Sử Dụng Gần Nhất
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stats.summary.paymentMethods.map((payment, index) => (
                <tr key={index} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[payment.method] || '#888888' }}
                      ></div>
                      <span className="font-medium">
                        {payment.method === 'COD' ? 'Tiền Mặt (COD)' :
                         payment.method === 'VNPAY' ? 'VNPay' :
                         payment.method === 'STRIPE' ? 'Stripe' :
                         payment.method}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {payment.orders} đơn
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-green-600">
                      ${Number(payment.spent).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    ${Number(payment.average).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {payment.lastUsed
                      ? new Date(payment.lastUsed).toLocaleDateString('vi-VN', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Row */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="grid grid-cols-5 gap-4 text-sm font-semibold">
            <div>Tổng Cộng</div>
            <div className="text-blue-600">{stats.summary.totalOrders} đơn</div>
            <div className="text-green-600">
              ${Number(stats.summary.totalSpent).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </div>
            <div className="text-gray-600">
              ${Number(stats.summary.totalSpent / stats.summary.totalOrders || 0).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </div>
            <div></div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          💡 <span className="font-semibold">Ghi chú:</span> Thống kê này chỉ hiển thị các đơn hàng đã hoàn thành. 
          Các đơn hàng đang chờ xử lý không được tính trong số liệu này.
        </p>
      </div>
    </div>
  );
}
