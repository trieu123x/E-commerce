"use client";
import { useEffect, useState } from "react";
import instance from "../../api/axios";
import { Trash2, Lock, Unlock } from "lucide-react";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await instance.get("/admin/users", {
        params: {
          page,
          limit,
          search: search || undefined,
        },
      });
      if (res.data.success) {
        setUsers(res.data.data);
        setTotal(res.data.pagination?.total || res.data.data.length);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLockUser = async (id) => {
    try {
      await instance.patch(`/admin/users/${id}/lock`);
      fetchUsers();
    } catch (error) {
      console.error("Error locking user:", error);
    }
  };

  const handleUnlockUser = async (id) => {
    try {
      await instance.patch(`/admin/users/${id}/unlock`);
      fetchUsers();
    } catch (error) {
      console.error("Error unlocking user:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa người dùng này?")) return;
    try {
      await instance.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const totalPages = Math.ceil(total / limit);

  if (loading && users.length === 0) {
    return <div className="text-center py-10">Đang tải...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản Lý Người Dùng</h1>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm theo email hoặc tên..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Tên</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Vai Trò</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Trạng Thái</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Ngày Tạo</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-3">{user.email}</td>
                <td className="px-6 py-3">{user.full_name || "N/A"}</td>
                <td className="px-6 py-3">
                  <span className={`px-2 py-1 rounded text-sm font-semibold ${
                    user.role === "admin"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-blue-100 text-blue-800"
                  }`}>
                    {user.role === "admin" ? "Admin" : "Khách Hàng"}
                  </span>
                </td>
                <td className="px-6 py-3">
                  <span className={`px-2 py-1 rounded text-sm font-semibold ${
                    user.status === "LOCKED"
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }`}>
                    {user.status === "LOCKED" ? "Khóa" : "Hoạt Động"}
                  </span>
                </td>
                <td className="px-6 py-3 text-sm">
                  {new Date(user.created_at).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-6 py-3 flex gap-2">
                  {user.status === "LOCKED" ? (
                    <button
                      onClick={() => handleUnlockUser(user.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-green-700"
                    >
                      <Unlock size={16} />
                      Mở Khóa
                    </button>
                  ) : (
                    <button
                      onClick={() => handleLockUser(user.id)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-yellow-600"
                    >
                      <Lock size={16} />
                      Khóa
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-red-700"
                  >
                    <Trash2 size={16} />
                    Xóa
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
    </div>
  );
}
