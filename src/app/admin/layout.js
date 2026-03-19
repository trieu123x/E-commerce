"use client";
import { useAuth } from "../context/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AdminSidebar from "./components/AdminSidebar";

export default function AdminLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Đang tải...</div>;
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 bg-gray-50 min-h-screen">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
