"use client";
import { toast } from "@/app/component/Toast";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/app/context/authContext";
import instance from "@/app/api/axios";
import { ins } from "framer-motion/client";
import { MapPin, ShoppingCart, Package, Truck, CreditCard } from "lucide-react";
export default function OrderPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { user, address,cart,setCart } = useAuth();
  const [product, setProduct] = useState();
  const product_id = searchParams.get("product_id");
  const quantity = parseInt(searchParams.get("quantity") || 1);
  const payment = "VISA"
  const type = searchParams.get("type");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await instance.get(`/products/${product_id}`);
        if (res.data.success) {
          setProduct(res.data.product);
        }
      } catch (error) {}
    };
    const fetchCart = async () => {
      const res = await instance.get(`/cart`);
      if (res.data.success) {
        
      }
    };
    if (type === "buyNow") fetchProduct();
    else if (type === "cart") {
      
    }
  }, []);

  // Đưa địa chỉ default lên đầu
  const sortedAddress = useMemo(() => {
    if (!address) return [];
    return [...address].sort((a, b) => b.is_default - a.is_default);
  }, [address]);
  useEffect(() => {
    if (sortedAddress.length > 0) {
      const defaultAddr =
        sortedAddress.find((a) => a.is_default) || sortedAddress[0];

      setSelectedAddress(defaultAddr.id);
    }
  }, [sortedAddress]);
  const handlePlaceOrder = async () => {
  if (!selectedAddress) {
    toast.error("Vui lòng chọn địa chỉ giao hàng");
    return;
  }

  try {
    setLoading(true);

    let payload = {
      address_id: selectedAddress,
      payment_method: payment,
    };

    if (type === "buyNow") {
      payload.product_id = product_id;
      payload.quantity = quantity;
    }

    if (type === "cart") {
      payload.items = cartItems.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity
      }));
    }

    const res = await instance.post("/order", payload);

    if (type === "cart") {
      const clearCart = await instance.delete("/cart/clear")
    setCart([])
    }
    router.push("/completed");

  } catch (error) {
    console.error(error);
    
  } finally {
    setLoading(false);
  }
};
 
  const cartItems = cart?.items || [];
  const summary = cart?.summary || {};

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 grid grid-cols-1 md:grid-cols-2 gap-10 text-white">
      {/* LEFT COLUMN */}
      <div className="bg-zinc-900 p-6 rounded-sm shadow-lg border border-zinc-800">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-orange-500">
          <MapPin size={20} />
          Shipping Information
        </h2>

        <div className="bg-black border border-zinc-800 rounded-lg p-4 mb-4 hover:border-orange-500 transition">
          <p className="font-semibold">{user?.fullName}</p>
          <p className="text-gray-400 text-sm">{user?.email}</p>
        </div>

        <label className="block mb-2 font-medium text-gray-300">
          Select Address
        </label>

        <select
          className="w-full bg-black border border-zinc-700 rounded-lg p-3 focus:border-orange-500 outline-none transition"
          value={selectedAddress || ""}
          onChange={(e) => setSelectedAddress(e.target.value)}
        >
          {sortedAddress.map((item) => (
            <option key={item.id} value={item.id}>
              {item.is_default ? "⭐ " : ""}
              {[item.house_number, item.street_name, item.ward, item.province].filter(Boolean).join(", ")}
            </option>
          ))}
        </select>
         <form className="flex mt-4 flex-col gap-4">

          {/* Card Number */}
          <div>
            <label className="block mb-2 font-medium text-gray-300 ">Card Number</label>
            <input
                          type="text"
                          
              placeholder="1234 5678 9012 3456"
              className="w-full bg-black border border-zinc-700 rounded-lg p-3 focus:border-orange-500 outline-none transition"
            />
          </div>

          {/* Cardholder Name */}
          <div>
            <label className="block mb-2 font-medium text-gray-300">Cardholder Name</label>
            <input
              type="text"
              placeholder="NGUYEN VAN A"
              className="w-full bg-black border border-zinc-700 rounded-lg p-3 focus:border-orange-500 outline-none transition"
            />
          </div>

          {/* Expiry + CVV */}
          <div className="flex gap-4 block mb-2 font-medium text-gray-300">
            <div className="flex-1">
              <label className="">Expiry Date</label>
              <input
                type="text"
                placeholder="MM/YY"
                className="bg-black border border-zinc-700 rounded-lg p-3 focus:border-orange-500 outline-none transition"
              />
            </div>

            <div className="flex-1">
              <label className="">CVV</label>
              <input
                type="password"
                placeholder="123"
                className="bg-black border border-zinc-700 rounded-lg p-3 focus:border-orange-500 outline-none transition"
              />
            </div>
          </div>

         

        </form>
      </div>

      {/* RIGHT COLUMN */}
      <div className="bg-zinc-900 p-6 rounded-sm shadow-lg border border-zinc-800">
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-orange-500">
          <ShoppingCart size={20} />
          Order Summary
        </h2>

        {/* BUY NOW */}
        {type === "buyNow" && product && (
          <div className="flex relative items-center gap-4 mb-6 bg-black p-4 rounded-lg border border-zinc-800 hover:border-orange-500 transition">
            {product.saleName && (
          <>
            <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-md z-10">
              SALE
            </div>
          </>
        )}
            <div className="w-16 h-16 relative  rounded-md">
              <img
                src={product?.images?.[0].image_url}
                alt={product?.name}
                className="w-full h-full object-cover hover:scale-110 transition duration-300"
              />
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full shadow">
                {quantity}
              </div>
            </div>

            <div className="flex-1">
              <p className="font-medium">{product?.name}</p>
            </div>

            <div className="font-semibold text-orange-400">
              ${((product.price_after ?? product.price) * quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        )}

        {/* CART */}
        {type === "cart" &&
          cartItems.map((item) => (
            <div
              key={item.id}
              className="flex relative items-center gap-4 mb-6 bg-black p-4 rounded-lg border border-zinc-800 hover:border-orange-500 transition"
            >
              {item.saleName && (
          <>
            <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-md z-10">
              SALE
            </div>
          </>
        )}
              <div className="w-16 h-16 relative rounded-md">
                <img
                  src={item?.image_url}
                  alt={item.name}
                  className="w-full h-full object-cover hover:scale-110 transition duration-300"
                />
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full shadow">
                  {item.quantity}
                </div>
              </div>

              <div className="flex-1">
                <p className="font-medium">{item.product_name}</p>
              </div>

              <div className="font-semibold text-orange-400">
                ${((item.price_after ?? item.price) * item.quantity).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
          ))}

        {/* Summary box */}
        <div className="bg-black p-4 rounded-lg border border-zinc-800 space-y-3">
          <div className="flex justify-between text-gray-300">
            <span className="flex items-center gap-2">
              <Package size={16} />
              Total Quantity
            </span>
            <span>{type === "buyNow" ? quantity : summary.totalQuantity}</span>
          </div>

          <div className="flex justify-between text-gray-300">
            <span className="flex items-center gap-2">
              <CreditCard size={16} />
              Subtotal
            </span>
            <span>
              ${
              (type === "buyNow"
                ? product?.price_after * quantity
                : summary.totalPrice)?.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              }
            </span>
          </div>

          <div className="flex justify-between text-gray-300">
            <span className="flex items-center gap-2">
              <Truck size={16} />
              Shipping
            </span>
            <span className="text-green-400">Free</span>
          </div>

          <div className="border-t border-zinc-700 pt-3 flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span className="text-orange-500">
              ${
              (type === "buyNow"
                ? product?.price_after * quantity
                : summary.totalPrice)?.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              }
            </span>
          </div>
        </div>

        <button
          onClick={handlePlaceOrder}
          className="w-full mt-6 bg-linear-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-semibold hover:scale-105 transition duration-300 shadow-lg hover:shadow-orange-500/40"
        >
          Place Order
        </button>
      </div>
    </div>
  );
}
