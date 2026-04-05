"use client";

import { useState } from "react";
import logImg from "../login/asserts/logImg.png";
import axios from "../api/axios";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        try {
            const response = await axios.post("/auth/forgot-password", { email });
            setMessage(response.data.message || "Link đặt lại mật khẩu đã được gửi đến email của bạn.");
        } catch (err) {
            console.error("Forgot password error:", err);
            setError(err.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex ">
            <div className="hidden md:flex w-1/2 items-center justify-center ">
                <div className=" bg-gray-300 rounded-md flex items-center justify-center">
                    <img src={logImg.src} className="w-full h-full object-cover" alt="Login background" />
                </div>
            </div>

            <div className="flex flex-1 items-center justify-center px-8">
                <div className="w-full max-w-md">
                    <h1 className="text-3xl font-semibold mb-2">Forgot Password</h1>
                    <p className="text-gray-500 mb-8 text-sm">Enter your email to receive a reset link</p>

                    {message && <p className="text-green-500 mb-4 bg-green-50 p-2 rounded border border-green-200">{message}</p>}
                    {error && <p className="text-red-500 mb-4 bg-red-50 p-2 rounded border border-red-200">{error}</p>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full border-b-2 border-gray-300 focus:border-black outline-none py-2 bg-transparent"
                            />
                        </div>

                        <div className="flex flex-col space-y-4 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`bg-red-500 font-semibold hover:bg-red-600 text-white px-8 py-2 rounded transition ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                                {loading ? "Sending..." : "Send Reset Link"}
                            </button>
                            
                            <Link href="/login" className="text-center text-sm text-gray-500 hover:text-red-500 transition">
                                Back to Login
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
