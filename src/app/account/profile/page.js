"use client";
import { toast } from "@/app/component/Toast";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/authContext";
import axios from "@/app/api/axios";
import { motion, AnimatePresence } from "framer-motion";
export default function ProfilePage() {
    const { user,setUser } = useAuth();
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
  });
  useEffect(() => {
    if (user && form.email === "") {
      setForm((prev) => ({
        ...prev,
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, [user, form.email]);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) return;

    let updatedFields = {};

    if (form.fullName !== user.fullName) {
      updatedFields.fullName = form.fullName;
    }

    if (form.phone !== user.phone) {
      updatedFields.phone = form.phone;
    }

    if(form.phone && !/^\d{10}$/.test(form.phone)) {
      setError("Phone number must be 10 digits");;p
        return;
      }
      if(form.fullName && form.fullName.length < 3) {
        setError("Full name must be at least 3 characters");
        return;
      }
      if (form.fullName === "") {
        setError("Full name cannot be empty");
        return;
      }
      if (form.phone === "") {
        setError("Phone number cannot be empty");
        return;
      }

    const res = await axios.put("/auth/profile", updatedFields);

    if (res.data.success) {
        setSuccess(true);
        setError("");
        setUser((prev) => {
            return { ...prev, ...form };
        })
  setTimeout(() => {
    setSuccess(false);
  }, 3000);
    } else {
      toast.error("Failed to update profile");
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
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-red-500 text-xl font-semibold">
            Edit Your Profile
          </h2>
          {user?.is_vip && (
            <div className="flex items-center gap-2 bg-gradient-to-r from-amber-100 to-amber-50 border border-amber-300 px-4 py-2 rounded-lg">
              <span className="text-2xl">⭐</span>
              <span className="font-semibold text-amber-700">VIP Member</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* VIP Status + Total Spent */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Total Spent</p>
              <p className="text-2xl font-bold text-blue-600">
                ${parseFloat(user?.total_spent || 0).toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {user?.is_vip ? "✓ VIP Status Active" : "Spend $100,000+ to become VIP"}
              </p>
            </div>
            <div className={`rounded-lg p-4 ${user?.is_vip ? 'bg-amber-50 border border-amber-200' : 'bg-gray-50 border border-gray-200'}`}>
              <p className="text-sm text-gray-600 mb-1">VIP Status</p>
              <p className="text-2xl font-bold">
                {user?.is_vip ? <span className="text-amber-600">⭐ VIP</span> : <span className="text-gray-400">Not VIP</span>}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {user?.is_vip ? "Thank you for being a loyal customer!" : "Almost there!"}
              </p>
            </div>
          </div>

          {/* Full Name + Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-gray-700">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="w-full mt-2 bg-gray-100 rounded-md p-3 outline-none focus:ring-2 focus:ring-red-400 transition"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700">Email</label>
              <input
                type="email"
                value={form.email}
                readOnly
                className="w-full mt-2 bg-gray-200 text-gray-500 cursor-not-allowed rounded-md p-3 outline-none"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm text-gray-700">Phone</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full mt-2 bg-gray-100 rounded-md p-3 outline-none focus:ring-2 focus:ring-red-400 transition"
            />
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
