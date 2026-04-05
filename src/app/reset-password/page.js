"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import logImg from "../login/asserts/logImg.png";
import axios from "../api/axios";
import Link from "next/link";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [token, setToken] = useState("");
    const [form, setForm] = useState({
        newPassword: "",
        confirmPassword: ""
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const t = searchParams.get("token");
        if (t) {
            setToken(t);
        } else {
            setError("Link không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu lại link mới.");
        }
    }, [searchParams]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (form.newPassword !== form.confirmPassword) {
            setError("Mật khẩu xác nhận không khớp.");
            return;
        }

        if (form.newPassword.length < 6) {
            setError("Mật khẩu phải có ít nhất 6 ký tự.");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post("/auth/reset-password", {
                token,
                newPassword: form.newPassword
            });
            setMessage("Đặt lại mật khẩu thành công! Đang chuyển hướng về trang đăng nhập...");
            setTimeout(() => {
                router.push("/login");
            }, 3000);
        } catch (err) {
            console.error("Reset password error:", err);
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
                    <h1 className="text-3xl font-semibold mb-2">Reset Password</h1>
                    <p className="text-gray-500 mb-8 text-sm">Enter your new password below</p>

                    {message && <p className="text-green-500 mb-4 bg-green-50 p-2 rounded border border-green-200">{message}</p>}
                    {error && <p className="text-red-500 mb-4 bg-red-50 p-2 rounded border border-red-200">{error}</p>}

                    {!token && !message && !loading && (
                        <Link href="/forgot-password" title="Quay lại trang quên mật khẩu" className="text-red-500 hover:underline">
                            Quay lại trang quên mật khẩu
                        </Link>
                    )}

                    {(token || loading || message) && (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    name="newPassword"
                                    value={form.newPassword}
                                    onChange={handleChange}
                                    required
                                    className="w-full border-b-2 border-gray-300 focus:border-black outline-none py-2 bg-transparent"
                                />
                            </div>

                            <div>
                                <input
                                    type="password"
                                    placeholder="Confirm New Password"
                                    name="confirmPassword"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    className="w-full border-b-2 border-gray-300 focus:border-black outline-none py-2 bg-transparent"
                                />
                            </div>

                            <div className="flex flex-col space-y-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={loading || !token || !!message}
                                    className={`bg-red-500 font-semibold hover:bg-red-600 text-white px-8 py-2 rounded transition ${(loading || !token || !!message) ? "opacity-50 cursor-not-allowed" : ""}`}
                                >
                                    {loading ? "Resetting..." : "Reset Password"}
                                </button>
                                
                                <Link href="/login" className="text-center text-sm text-gray-500 hover:text-red-500 transition">
                                    Back to Login
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>}>
            <ResetPasswordForm />
        </Suspense>
    );
}
