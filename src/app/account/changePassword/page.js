"use client";
import { useState } from "react";
import instance from "../../api/axios";
import { useAuth } from "../../context/authContext";
import { motion, AnimatePresence } from "framer-motion";
export default function ChangePasswordPage() {
    const { user } = useAuth();
    const [form, setForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (form.newPassword !== form.confirmNewPassword) {
            setError("New password and confirm password do not match");
            return;
        }
        try {
            const res = await instance.put("/auth/change-password", {
                currentPassword: form.currentPassword,
                newPassword: form.newPassword,
            });
            if (res.data.success) {
                setSuccess(true);
                setForm({
                    currentPassword: "",
                    newPassword: "",
                    confirmNewPassword: "",
                });
                setTimeout(() => {
                    setSuccess(false);
                }, 3000);
            } else {
                setError(res.data.message || "Failed to change password");
            }
        } catch (error) {
            setError(
                error.response?.data?.message || "An error occurred while changing password"
            );
        }
    };

    return (
        <div className=" min-h-screen py-10 mx-auto">
          {error && (
        <div className="bg-red-500 text-white px-6 py-3 rounded-md shadow-lg mb-6">
          {error}
        </div>
      )}
          <AnimatePresence>
  {success && (
    <motion.div
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -80, opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 
                 bg-green-500 text-white px-6 py-3 
                 rounded-md shadow-lg z-50"
    >
      Profile updated successfully
    </motion.div>
  )}
</AnimatePresence>
      <div className="max-w-5xl mx-auto bg-white p-10 rounded-md shadow-sm border border-gray-200">
        <h2 className="text-red-500 text-xl font-semibold mb-8">
          Change Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1  gap-6">
            <div>
              <label className="text-sm text-gray-700">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={form.currentPassword}
                onChange={handleChange}
                className="w-full mt-2 bg-gray-100 rounded-md p-3 outline-none focus:ring-2 focus:ring-red-400 transition"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                className="w-full mt-2 bg-gray-100 rounded-md p-3 outline-none focus:ring-2 focus:ring-red-400 transition"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700">Confirm New Password</label>
              <input
                type="password"
                name="confirmNewPassword"
                value={form.confirmNewPassword}
                onChange={handleChange}
                className="w-full mt-2 bg-gray-100 rounded-md p-3 outline-none focus:ring-2 focus:ring-red-400 transition"
              />
            </div>
          </div>

          
                  

          {/* Buttons */}
          <div className="flex justify-end items-center gap-6 pt-4">
            <button
              type="button"
              className="text-gray-600 hover:text-black transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
    );
}