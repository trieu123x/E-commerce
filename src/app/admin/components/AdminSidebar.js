"use client";
import Link from "next/link";
import { useAuth } from "../../context/authContext";
import { useRouter } from "next/navigation";
import { Package, FolderOpen, Users, ShoppingCart, MessageSquareText } from "lucide-react";

export default function AdminSidebar() {
  const { user, setUser } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-6">
      <div onClick={()=>{router.push("/admin")}} className="mb-8">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <p className="text-gray-400 text-sm mt-2">{user?.fullName}</p>
      </div>

      <nav className="space-y-2">
        <Link href="/admin/products" className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg transition">
          <Package size={20} />
          <span>Sản Phẩm</span>
        </Link>
        <Link href="/admin/categories" className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg transition">
          <FolderOpen size={20} />
          <span>Danh Mục</span>
        </Link>
        <Link href="/admin/users" className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg transition">
          <Users size={20} />
          <span>Người Dùng</span>
        </Link>
        <Link href="/admin/orders" className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg transition">
          <ShoppingCart size={20} />
          <span>Đơn Hàng</span>
        </Link>
         <Link href="/admin/reviews" className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg transition">
          <MessageSquareText size={20} />
          <span>Đánh giá</span>
        </Link>
         <Link href="/admin/sale" className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg transition">
          <MessageSquareText size={20} />
          <span>Giảm giá</span>
        </Link>
      </nav>

      
    </div>
  );
}
