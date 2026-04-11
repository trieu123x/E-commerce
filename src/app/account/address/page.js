"use client";

import { useState, useEffect, use } from "react";
import { useAuth } from "@/app/context/authContext";
import axios from "@/app/api/axios";
import { Pencil, Trash2, Star } from "lucide-react";

export default function AddressPage() {
  const [form, setForm] = useState({
    house_number: "",
    street_name: "",
    province: "",
    ward: "",
    is_default: false,
  });
  const [editingAddress, setEditingAddress] = useState(null);
  const { address, setAddress } = useAuth();
  const [provincesData, setProvincesData] = useState([]);

  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/v2/?depth=2")
      .then((res) => res.json())
      .then((data) => {
        // API v2 returns array directly or wrapped in data property
        const provinces = Array.isArray(data) ? data : (data.data || []);
        setProvincesData(provinces);
      })
      .catch((err) => console.error("Failed to load provinces:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { 
      house_number: form.house_number,
      street_name: form.street_name,
      province: form.province,
      ward: form.ward,
      is_default: form.is_default,
    };

    try {
      const res = await axios.post("/address", payload);

      if (res.data.success) {
        setForm({
          house_number: "",
          street_name: "",
          province: "",
          ward: "",
          is_default: false,
        });

        setAddress([...address, res.data.data]);
      }
    } catch (error) {
      console.error("Create address error:", error);
    }
  };
  const handleSetDefault = async (id) => {
    try {
      const res = await axios.put(`/address/${id}/set-default`);
      if (res.data.success) {
        const updatedAddress = address
          .map((addr) =>
            addr.id === id
              ? { ...addr, is_default: true }
              : { ...addr, is_default: false },
          )
          .sort((a, b) => b.is_default - a.is_default);
        setAddress(updatedAddress);
      }
    } catch (error) {
      console.error("Failed to set default address:", error);
    }
  };
  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`/address/${id}`);
      if (res.data.success) {
        const updatedAddress = address.filter((addr) => addr.id !== id);
        setAddress(updatedAddress);
      }
    } catch (error) {
      console.error("Failed to delete address:", error);
    }
  };
  const handleEditFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = { 
        house_number: editingAddress.house_number,
        street_name: editingAddress.street_name,
        province: editingAddress.province,
        ward: editingAddress.ward,
        is_default: editingAddress.is_default,
      };

      const res = await axios.put(
        `/address/${editingAddress.id}`,
        payload,
      );

      if (res.data.success) {
        const updatedList = address.map((item) =>
          item.id === editingAddress.id ? res.data.data : item,
        );

        setAddress(updatedList);
        setEditingAddress(null);
      }
    } catch (error) {
      console.error("Edit failed:", error);
    }
  };

  const editSelectedProvince = provincesData?.find((p) => p.name === editingAddress?.province);
  const editAvailableWards = editSelectedProvince?.wards || [];

  const formSelectedProvince = provincesData?.find((p) => p.name === form.province);
  const formAvailableWards = formSelectedProvince?.wards || [];

  return (
    <div className="min-h-screen py-10">
      {editingAddress && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-lg relative">
            <h2 className="text-lg font-semibold mb-6">Edit Address</h2>

            <form onSubmit={handleEditFormSubmit} className="space-y-4">
              <select
                name="province"
                value={editingAddress.province || ""}
                onChange={(e) =>
                  setEditingAddress({
                    ...editingAddress,
                    province: e.target.value,
                    ward: "",
                  })
                }
                className="w-full p-3 bg-gray-100 rounded-md"
              >
                <option value="">Select Province</option>
                {provincesData.map((p) => (
                  <option key={p.code} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>

              <select
                name="ward"
                value={editingAddress.ward || ""}
                onChange={(e) =>
                  setEditingAddress({
                    ...editingAddress,
                    ward: e.target.value,
                  })
                }
                className="w-full p-3 bg-gray-100 rounded-md disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                disabled={!editingAddress.province}
              >
                <option value="">Select Ward</option>
                {(editAvailableWards || []).map((d) => (
                  <option key={d.code} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                name="house_number"
                placeholder="Số nhà (tuỳ chọn)"
                value={editingAddress.house_number || ""}
                onChange={(e) =>
                  setEditingAddress({
                    ...editingAddress,
                    house_number: e.target.value,
                  })
                }
                className="w-full p-3 bg-gray-100 rounded-md"
              />

              <input
                type="text"
                name="street_name"
                placeholder="Tên đường (tuỳ chọn)"
                value={editingAddress.street_name || ""}
                onChange={(e) =>
                  setEditingAddress({
                    ...editingAddress,
                    street_name: e.target.value,
                  })
                }
                className="w-full p-3 bg-gray-100 rounded-md"
              />

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingAddress(null)}
                  className="px-4 py-2 rounded-md"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* LEFT - FORM */}
        <div className="bg-white p-8 rounded-lg shadow ">
          <h2 className="text-xl font-semibold mb-6 text-red-500">
            Add New Address
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <select
              name="province"
              value={form.province}
              onChange={(e) => setForm({ ...form, province: e.target.value, ward: "" })}
              className="w-full p-3 bg-gray-100 rounded-md"
              required
            >
              <option value="">Select Province</option>
              {provincesData.map((p) => (
                <option key={p.code} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>

            <select
              name="ward"
              value={form.ward}
              onChange={handleChange}
              className="w-full p-3 bg-gray-100 rounded-md disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
              required
              disabled={!form.province}
            >
              <option value="">Select Ward</option>
              {(formAvailableWards || []).map((d) => (
                <option key={d.code} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              name="house_number"
              placeholder="Số nhà (tuỳ chọn)"
              value={form.house_number}
              onChange={handleChange}
              className="w-full p-3 bg-gray-100 rounded-md"
            />

            <input
              type="text"
              name="street_name"
              placeholder="Tên đường (tuỳ chọn)"
              value={form.street_name}
              onChange={handleChange}
              className="w-full p-3 bg-gray-100 rounded-md"
            />

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="is_default"
                checked={form.is_default}
                onChange={handleChange}
              />
              Set as default address
            </label>

            <button
              type="submit"
              className="bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600 transition"
            >
              Add Address
            </button>
          </form>
        </div>

        {/* RIGHT - LIST */}
        <div className="bg-white p-8 overflow-auto max-h-120 grow rounded-lg shadow ">
          <h2 className="text-xl font-semibold mb-6">Your address</h2>

          {address?.length === 0 && (
            <p className="text-gray-500">No address? added yet.</p>
          )}

          <div className="space-y-4">
            {address?.map((item) => (
              <div
  key={item.id}
  className={`relative p-5 rounded-xl border transition-all duration-300 
    shadow-sm hover:shadow-lg hover:-translate-y-1
    ${
      item.is_default
        ? "border-red-500 bg-red-50"
        : "border-gray-200 bg-white"
    }`}
>
  {/* Badge Default */}
  {item.is_default && (
    <span className="absolute top-3 right-3 text-xs bg-red-500 text-white px-2 py-1 rounded-full font-semibold">
      Default
    </span>
  )}

  {/* Address Info */}
  <div className="space-y-1">
    {(item.house_number || item.street_name) && (
      <p className="font-semibold text-gray-800">
        {[item.house_number, item.street_name].filter(Boolean).join(", ")}
      </p>
    )}
    <p className="text-sm text-gray-600">
      {[item.ward, item.province].filter(Boolean).join(", ")}
    </p>
  </div>

  {/* Action Buttons */}
  <div className="flex gap-4 mt-4">
    {!item.is_default && (
      <button
        onClick={() => handleSetDefault(item.id)}
        className="p-2 rounded-full hover:bg-yellow-100 transition transform hover:scale-110"
        title="Set as default"
      >
        <Star className="w-5 h-5 text-yellow-500" />
      </button>
    )}

    <button
      onClick={() => setEditingAddress(item)}
      className="p-2 rounded-full hover:bg-blue-100 transition transform hover:scale-110"
      title="Edit"
    >
      <Pencil className="w-5 h-5 text-blue-500" />
    </button>

    <button
      onClick={() => handleDelete(item.id)}
      className="p-2 rounded-full hover:bg-red-100 transition transform hover:scale-110"
      title="Delete"
    >
      <Trash2 className="w-5 h-5 text-red-500" />
    </button>
  </div>
</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
