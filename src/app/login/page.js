"use client";

import { useState } from "react";
import logImg from "../login/asserts/logImg.png";
import axios from "../api/axios";
import Link from "next/link";
export default function LoginPage() {
  const [error, setError] = useState("");
    const [form,setForm] = useState({
        email:"",
        password:""
    })
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const response = await axios.post("/auth/login", form);
            const { token, user } = response.data;
            localStorage.setItem("token", token);
            console.log("Login successful:", response.data);
        } catch (error) {
            console.error("Login failed:", error);
            setError("Invalid email or password.");
            setTimeout(() => {
                setError("");
            }, 3000);
        }
    }

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
          <h1 className="text-3xl font-semibold mb-2">
            Log in to Exclusive
          </h1>
          <p className="text-gray-500 mb-8 text-sm">
            Enter your details below
          </p>
            {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
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

            {/* Button + Forgot */}
            <div className="flex items-center justify-between pt-4">
              <button
                type="submit"
                className="bg-red-500 font-semibold hover:bg-red-600 text-white px-8 py-2 rounded transition"
              >
                Log In
              </button>

              <button
                type="button"
                className="text-red-500 text-sm hover:underline"
              >
                Forget Password?
              </button>
                      </div>
                      {/* Dont have an account? */}
                    <div className="text-center pt-4">
                <p className="text-gray-500 ">
                  Don't have an account?{" "}
                  <Link href="/signup"                   className="relative font-semibold inline-block text-red-500 after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-full after:bg-red-500 after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100"
>
                    Sign Up
                  </Link>
                </p>
              </div>
          </form>
        </div>
      </div>
    </div>
  );
}