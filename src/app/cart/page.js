"use client";

import { useMemo, useState } from "react";
import { useAuth } from "../context/authContext";
import { X } from "lucide-react";
import instance from "../api/axios";
import QuantityControl from "./components/quantityControl";
import { useRouter } from "next/navigation";
export default function CartPage() {
  const router = useRouter();
  const { cart, setCart } = useAuth();
  const items = cart?.items || [];

  const removeItem = async (id) => {
    try {
      await instance.delete(`/cart/items/${id}`);
      setCart((prev) => ({
        ...prev,
        items: prev.items.filter((i) => i.id != id),
      }));
    } catch (error) {
      console.log("error remove from cart:", error);
    }
  };

  const subtotal = useMemo(() => {
  return items.reduce((total, item) => {
    const price = item.price_after!= item.price ? item.price_after : item.price;
    return total + price * item.quantity;
  }, 0);
  }, [items]);
  
  console.log(cart)
  
  return (
    <div className=" min-h-screen py-10 px-6">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex gap-3">
          <p className="text-gray-400">Home</p>
          <p className="text-gray-400">/</p>
          <p>Cart</p>
        </div>
        {/* Header */}
        <div className="grid grid-cols-4 border border-gray-200 shadow bg-white p-4  font-semibold text-gray-600">
          <div>Product</div>
          <div>Price</div>
          <div>Quantity</div>
          <div className="text-right">Subtotal</div>
        </div>

        {/* Cart Items */}
        {items.map((item) => (
          <div
            key={item.id}
            className="grid relative grid-cols-4 bg-white p-6 items-center shadow-sm"
          >
{item.saleName && (
          <>
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-md z-10">
              {item.saleName}
            </div>
          </>
        )}
            <button
              onClick={() => removeItem(item.id)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600 transition"
            >
              <X size={14} />
            </button>
            {/* Product + Image */}
            <div className="flex items-center gap-4 relative">
              {/* Product Image wrapper */}
              <div className="relative w-20 h-20">
                {/* Nút X góc trái trên */}

                {/* Image */}
                <img
                  src={item.image_url || item.image}
                  alt={item.product_name}
                  className="w-full h-full object-cover rounded-md border"
                />
              </div>

              {/* Product Name */}
              <span className="font-medium">{item.product_name}</span>
            </div>

            {/* Price */}
            {item.price != item.price_after ? (
          <>
            <div className="flex flex-col items-left gap-2">
              <span className="text-red-500 font-bold">
                ${parseFloat(item.price_after).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>

              {item.price_after < item.price && (
                <span className="text-gray-400 line-through text-sm">
                  ${parseFloat(item.price).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                </span>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-red-500 font-bold">
                $
                {parseFloat(item.price).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </>
        )}

            {/* Quantity */}
            <QuantityControl item={item} setCart={setCart} />

            {/* Subtotal */}
            <div className="text-right font-semibold">
              $
              {((item.price_after ?? item.price )* item.quantity).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </div>
        ))}

        {/* Bottom Section */}
        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Coupon */}
          {/* <div className="flex gap-4">
            <input
              placeholder="Coupon Code"
              className="border rounded-lg p-3 flex-1 h-12"
            />
            <button className="bg-red-500 text-white px-6 rounded-lg h-12">
              Apply Coupon
            </button>
          </div> */}
          <div className="flex gap-4">
            <button
              onClick={() => {
                router.push("/products");
              }}
              className="bg-red-500 text-white px-6 rounded-lg h-12"
            >
              Return to shop
            </button>
          </div>
          {/* Cart Total */}
          <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
            <h2 className="text-lg font-semibold">Cart Total</h2>

            <div className="flex justify-between border-b pb-2">
              <span>Subtotal:</span>
              <span>
                $
                {subtotal.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span>Shipping:</span>
              <span>Free</span>
            </div>

            <div className="flex justify-between font-semibold text-lg">
              <span>Total:</span>
              <span>
                $
                {subtotal.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>

            <button
              onClick={() => {
                router.push(`/checkout?type=${"cart"}`);
              }}
              className="bg-red-500 text-white w-full py-3 rounded-lg mt-4"
            >
              Proceed to checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
