"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Package, FolderOpen, Users, ShoppingCart, TrendingUp } from "lucide-react";
import instance from "../api/axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";

export default function AdminDashboard() {
  const { user, loading,products } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    products: 97,
    users: 7,
    orders: 14,
    categories: 5,
  });
  const [year, setYear] = useState(new Date().getFullYear());
  const [revenueData, setRevenueData] = useState([]);
  const [loadingChart, setLoadingChart] = useState(false);
  const [topProducts, setTopProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Format số tiền theo kiểu 1M, 2M, 3M
  const formatCurrency = (value) => {
    if (!value) return '$0';
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (numValue >= 1000000) {
      return `$${(numValue / 1000000).toFixed(1)}M`;
    } else if (numValue >= 1000) {
      return `$${(numValue / 1000).toFixed(1)}K`;
    }
    return `$${numValue.toFixed(0)}`;
  };

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Fetch revenue data
  useEffect(() => {
  const fetchRevenueData = async () => {
    try {
      setLoadingChart(true);

      const res = await instance.get(`/admin/products/stats?year=${year}`);

      if (res.data.success) {
        setRevenueData(res.data.data);
      }

    } catch (error) {
      console.error("Error fetching revenue data:", error);
    } finally {
      setLoadingChart(false);
    }
  };

  if (user && user.role === "admin") {
    fetchRevenueData();
  }
}, [user, year]);
useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const res = await instance.get(
          "/admin/products/top-products"
        );
         
        if (res.data.success) {
          setTopProducts(res.data.data);
          
        }
      } catch (err) {
        console.error("Fetch top products error:", err);
      }
    };

    fetchTopProducts();
}, [user]);
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await instance.get("/admin/products/dashboard")
        if (res.data.success) {
          console.log(res.data.data)
          const data = res.data.data
          setStats(data)
        }
      } catch (err) {
        console.log(err)
      }
    }
    fetchDashboard()
  },[user])
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Đang tải...</div>;
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Chào Mừng, {user.fullName}!</h1>
          <p className="text-gray-600">Bảng điều khiển quản lý cửa hàng</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link
            href="/admin/products"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Sản Phẩm</p>
                <p className="text-3xl font-bold mt-2">{stats.products}</p>
              </div>
              <Package size={40} className="text-blue-600" />
            </div>
          </Link>

          <Link
            href="/admin/categories"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Danh Mục</p>
                <p className="text-3xl font-bold mt-2">{stats.categories}</p>
              </div>
              <FolderOpen size={40} className="text-green-600" />
            </div>
          </Link>

          <Link
            href="/admin/users"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Người Dùng</p>
                <p className="text-3xl font-bold mt-2">{stats.users}</p>
              </div>
              <Users size={40} className="text-purple-600" />
            </div>
          </Link>

          <Link
            href="/admin/orders"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Đơn Hàng</p>
                <p className="text-3xl font-bold mt-2">{stats.orders}</p>
              </div>
              <ShoppingCart size={40} className="text-orange-600" />
            </div>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="text-blue-600" />
              Thống Kê Doanh Thu Theo Tháng
            </h2>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium bg-white"
            >
              {[...Array(10)].map((_, i) => {
                const y = new Date().getFullYear() - 5 + i;
                return (
                  <option key={y} value={y}>
                    Năm {y}
                  </option>
                );
              })}
            </select>
          </div>
          
          {loadingChart ? (
            <div className="h-80 flex items-center justify-center text-gray-500">
              Đang tải dữ liệu...
            </div>
          ) : revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={revenueData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  stroke="#666"
                />
                <YAxis 
                  stroke="#666"
                  width={80}
                  formatter={formatCurrency}
                />
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  labelStyle={{ color: '#000' }}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#2563eb" 
                  strokeWidth={2}
                  dot={{ fill: '#2563eb', r: 5 }}
                  activeDot={{ r: 7 }}
                  name="Doanh Thu ($)"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-500">
              Chưa có dữ liệu doanh thu
            </div>
          )}
        </div>

        {/* TOP PRODUCTS CHART */}
        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Package className="text-green-600" />
            Top 10 Sản Phẩm Bán Chạy
          </h2>
          
          {loadingChart ? (
            <div className="h-80 flex items-center justify-center text-gray-500">
              Đang tải dữ liệu...
            </div>
          ) : topProducts.length > 0 ? (
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center font-bold text-blue-600">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{product.name}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex-1">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500"
                            style={{ width: `${(product.sold_quantity / topProducts[0].sold_quantity) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{product.sold_quantity} cái</p>
                        <p className="text-xs text-gray-500">{formatCurrency(product.revenue)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-500">
              Chưa có dữ liệu sản phẩm bán chạy
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="text-blue-600" />
            Quản Lý Nhanh
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/admin/products"
              className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg hover:from-blue-100 hover:to-blue-200 transition"
            >
              <p className="font-semibold text-blue-900">Quản Lý Sản Phẩm</p>
              <p className="text-sm text-blue-700 mt-1">
                Thêm, sửa, xóa sản phẩm
              </p>
            </Link>
            <Link
              href="/admin/categories"
              className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg hover:from-green-100 hover:to-green-200 transition"
            >
              <p className="font-semibold text-green-900">Quản Lý Danh Mục</p>
              <p className="text-sm text-green-700 mt-1">
                Tổ chức danh mục sản phẩm
              </p>
            </Link>
            <Link
              href="/admin/users"
              className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg hover:from-purple-100 hover:to-purple-200 transition"
            >
              <p className="font-semibold text-purple-900">Quản Lý Người Dùng</p>
              <p className="text-sm text-purple-700 mt-1">
                Kiểm soát tài khoản người dùng
              </p>
            </Link>
            <Link
              href="/admin/orders"
              className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg hover:from-orange-100 hover:to-orange-200 transition"
            >
              <p className="font-semibold text-orange-900">Quản Lý Đơn Hàng</p>
              <p className="text-sm text-orange-700 mt-1">
                Theo dõi và xử lý đơn hàng
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
