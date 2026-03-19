"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, MapPin, CreditCard, ShoppingBag, Heart,Cog } from "lucide-react";
import { useAuth } from "@/app/context/authContext";
import { Corben } from "next/font/google";
export default function AccountSidebar() {
  const pathname = usePathname();
  const { user,setUser } = useAuth();
  const linkClass = "flex items-center gap-3 px-3 py-2 rounded-md transition";

  const activeClass = "text-red-500 font-medium";
  const normalClass = "text-gray-500 hover:text-red-500";

  const isActive = (path) => pathname === path;

  return (
    <div className="flex py-8 my-8 mb-8 flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold mb-1">
          Hello, {user ? user.fullName : "Guest"}
        </h2>
        <p className="text-sm text-gray-500">
          Welcome to your account dashboard
        </p>
      </div>
      <div className="w-80 ml-8">
        <h3 className="font-semibold mb-3">Manage My Account</h3>

        <div className="flex flex-col gap-2 ml-2">
          <Link
            href="/account/profile"
            className={`${linkClass} ${
              isActive("/account/profile") ? activeClass : normalClass
            }`}
          >
            <User size={18} />
            My Profile
          </Link>

          <Link
            href="/account/address"
            className={`${linkClass} ${
              isActive("/account/address") ? activeClass : normalClass
            }`}
          >
            <MapPin size={18} />
            Address Book
          </Link>

          <Link
            href="/account/payment"
            className={`${linkClass} ${
              isActive("/account/payment") ? activeClass : normalClass
            }`}
          >
            <CreditCard size={18} />
            My Payment Options
          </Link>

          <Link
            href="/your-order"
            className={`${linkClass} ${
              isActive("/account/orders") ? activeClass : normalClass
            }`}
          >
            <ShoppingBag size={18} />
            My Orders
          </Link>

          <Link
            href="/wishlist"
            className={`${linkClass} ${
              isActive("/account/wishlist") ? activeClass : normalClass
            }`}
          >
            <Heart size={18} />
            My WishList
          </Link>
          <Link
            href="/account/changePassword"
            className={`${linkClass} ${
              isActive("/account/changePassword") ? activeClass : normalClass
            }`}
          >
            <Cog size={18} />
            Change Password
          </Link>
        </div>
      </div>
    </div>
  );
}
