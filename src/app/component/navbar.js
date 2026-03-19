"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import instance from "../api/axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/authContext.js";
export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const { cartCount, setCartCount, wishlistCount, setWishlistCount } =
    useAuth();
  const dropdownRef = useRef(null);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await instance.get("/auth/me");
        setUser(response.data);
        console.log("Auth check response:", response.data);
      } catch (error) {
        console.error("Auth check failed:", error);
      }
    };
    checkAuth();
  }, []);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    router.push("/login");
  }

  return (
    <>
      <nav className=" h-20 border-b-2 p-2 border-gray-200">
        <div className="container mx-auto h-full grid grid-cols-3 items-center">
          <h1 className="text-2xl font-bold">Exclusive</h1>
          <div className="justify-center flex mr-24 gap-8">
            <Link
              href="/"
              className="relative group text-gray-600 hover:text-black transition"
            >
              Home
              <span className="absolute left-1/2 bottom-0 h-0.5 w-0 bg-black transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
            </Link>

            <a
              href="/contact"
              className="relative group text-gray-600 hover:text-black transition"
            >
              Contact
              <span className="absolute left-1/2 bottom-0 h-0.5 w-0 bg-black transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
            </a>

            <a
              href="/about"
              className="relative group text-gray-600 hover:text-black transition"
            >
              About
              <span className="absolute left-1/2 bottom-0 h-0.5 w-0 bg-black transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
            </a>

            {user ? (
              <Link
                href="/products"
                className="relative pb-0.5 group text-gray-600 hover:text-black transition"
              >
                Product
                <span className="absolute left-1/2 bottom-0 h-0.5 w-0 bg-black transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
              </Link>
            ) : (
              <Link
                href="/signup"
                className="relative pb-0.5 group text-gray-600 hover:text-black transition"
              >
                Signup
                <span className="absolute left-1/2 bottom-0 h-0.5 w-0 bg-black transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
              </Link>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <div className="relative w-60">
              <input
                type="text"
                placeholder="What are you looking for?"
                className="w-full bg-gray-100 text-sm rounded-md py-2 pl-4 pr-10 outline-none focus:ring-2 focus:ring-black transition"
              />

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m1.6-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            {/* heart Icon */}
            <button
              onClick={() => {
                setWishlistCount(0)
                router.push("/wishlist")
              }}
              className=" w-10 cursor-pointer h-10 flex items-center justify-center rounded-full 
                 transition-all duration-300 
                 hover:bg-orange-500 group"
            >
              <div className="text-gray-700 relative group-hover:text-white transition">
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {wishlistCount}
                  </span>
                )}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 "
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364 4.318 12.682a4.5 4.5 0 010-6.364z"
                  />
                </svg>
              </div>
            </button>
            {/* Cart icons */}
            <button
              onClick={() => {
                setCartCount(0),
                  router.push("/cart")
              }}
              className="w-10 cursor-pointer h-10 flex items-center justify-center rounded-full 
                 transition-all duration-300 
                 hover:bg-orange-500 group"
            >
              <div className="text-gray-700 relative group-hover:text-white transition">
                {cartCount > 0 && (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
      {cartCount}
    </span>
  )}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 "
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 7h13M7 13l-1.5-7M10 21a1 1 0 102 0 1 1 0 00-2 0zm8 0a1 1 0 102 0 1 1 0 00-2 0z"
                  />
                </svg>
              </div>
            </button>
            {user && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => {
                    setOpen(!open);
                  }}
                  className="w-10 cursor-pointer h-10 flex items-center justify-center rounded-full 
                 transition-all duration-300 
                 hover:bg-orange-500 group"
                >
                  <div className="text-gray-700 group-hover:text-white transition">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z"
                      />
                    </svg>
                  </div>
                </button>
                {open && (
                  <div className="absolute z-999 right-0 mt-3 w-56 bg-linear-to-br from-gray-800 to-purple-800 text-white rounded-xl shadow-xl p-4 space-y-3 animate-fadeIn">
                    <div
                      onClick={() => {
                        router.push("/account");
                      }}
                      className="flex items-center gap-3 cursor-pointer hover:text-orange-400 transition"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>

                      <span>Account</span>
                    </div>
                    <div onClick={()=>{
                      router.push("/your-order")
                    }} className="flex items-center gap-3 cursor-pointer hover:text-orange-400 transition">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                        />
                      </svg>

                      <span>Orders</span>
                    </div>
                    <div className="flex items-center gap-3 cursor-pointer hover:text-orange-400 transition">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                        />
                      </svg>

                      <span>My Reviews</span>
                    </div>
                    <div onClick={handleLogout} className="flex items-center gap-3 cursor-pointer hover:text-orange-400 transition">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                        />
                      </svg>

                      <span>Logout</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
