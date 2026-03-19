"use client";

import { useState } from "react";
import logImg from "../login/asserts/logImg.png";
import Link from "next/link";
import axios from "../api/axios";
import { useRouter } from "next/navigation";
export default function LoginPage() {
    const router = useRouter();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post("/auth/register", form);
        console.log("Registration successful:", response.data);
        router.push("/login");
    } catch (error) {
      console.error("Registration failed:", error);
        if (error.response?.status === 409) {
            setError("Email already in use, try another one.");
            setTimeout(() => {
                setError("");
            }, 3000);
      }
    }
  };

  return (
    <div className="min-h-screen flex ">
      <div className="hidden md:flex w-1/2 items-center justify-center ">
        <div className=" bg-gray-300 rounded-md flex items-center justify-center">
          <img src={logImg.src} className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Right Form */}
      <div className="flex flex-1 items-center justify-center px-8">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-semibold mb-2">Create an account</h1>
          <p className="text-gray-500 mb-8">Enter your details below</p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                      {error && <p className="text-red-500 ">{error}</p>}
            {/* fullName */}
            <div>
              <input
                type="text"
                placeholder="Full Name"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 focus:border-black outline-none py-2 bg-transparent"
              />
            </div>
            {/* Email */}
            <div>
              <input
                type="text"
                placeholder="Email or Phone Number"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 focus:border-black outline-none py-2 bg-transparent"
              />
            </div>

            {/* Password */}
            <div>
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 focus:border-black outline-none py-2 bg-transparent"
              />
            </div>

            {/* Button */}
            <div className="flex items-center justify-between pt-4">
              <button
                type="submit"
                className="bg-red-500 w-full hover:bg-red-600 text-white px-8 py-2 rounded transition"
              >
                Sign Up
              </button>
            </div>

            {/* Already have an account? */}
            <div className="">
              <p className="text-gray-500 ">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="relative font-semibold inline-block text-red-500 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-red-500 after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100"
                >
                  Log in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
