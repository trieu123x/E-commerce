"use client";
import Sidebar from "./components/sidebar.js";
import { useAuth } from "../context/authContext.js";
export default function AccountLayout({ children }) {
  return (
      <div className="container pl-16  flex gap-5">
          <Sidebar />
      {children}
    </div>
  );
}