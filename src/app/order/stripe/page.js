"use client";
import { toast } from "@/app/component/Toast";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/app/context/authContext";
import instance from "@/app/api/axios";
import { MapPin, ShoppingCart, Package, Truck, CreditCard, Loader2 } from "lucide-react";

export default function StripeOrderPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { user, address, cart, setCart } = useAuth();
  const [product, setProduct] = useState();
  const product_id = searchParams.get("product_id");
  const quantity = parseInt(searchParams.get("quantity") || 1);
  const payment = "STRIPE";
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
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    if (type === "buyNow" && product_id) fetchProduct();
  }, [type, product_id]);

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
        payload.items = cart.items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        }));
      }

      // 1. Tạo đơn hàng (Sử dụng endpoint /order đúng)
      const res = await instance.post("/order", payload);
      const orderId = res.data.data.id;

      // 2. Nếu là cart thì xóa giỏ hàng
      if (type === "cart") {
        try {
          await instance.delete("/cart/clear");
          setCart([]);
        } catch (err) {
          console.error("Lỗi xóa giỏ hàng:", err);
        }
      }

      // 3. Gọi API tạo Stripe Checkout Session
      const stripeRes = await instance.post("/payment/stripe/create", {
        orderId,
      });

      if (stripeRes.data && stripeRes.data.payUrl) {
        // 4. Redirect sang Stripe
        window.location.href = stripeRes.data.payUrl;
      } else {
        toast.error("Lỗi khi tạo link thanh toán Stripe");
      }

    } catch (error) {
      console.error("Lỗi đặt hàng:", error);
      toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi tạo đơn hàng.");
    } finally {
      setLoading(false);
    }
  };

  const cartItems = cart?.items || [];
  const summary = cart?.summary || {};

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 grid grid-cols-1 md:grid-cols-2 gap-10 text-white min-h-screen bg-black">
      {/* LEFT COLUMN: Shipping & Payment Info */}
      <div className="bg-zinc-900 p-8 rounded-2xl shadow-2xl border border-zinc-800">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
          <MapPin className="text-zinc-400" size={24} />
          Thông tin giao hàng
        </h2>

        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 mb-6">
          <p className="font-bold text-lg text-white">{user?.fullName}</p>
          <p className="text-zinc-400">{user?.email}</p>
        </div>

        <label className="block mb-3 font-semibold text-zinc-300">
          Chọn địa chỉ nhận hàng
        </label>

        <select
          className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-4 focus:border-white outline-none transition text-white mb-8"
          value={selectedAddress || ""}
          onChange={(e) => setSelectedAddress(e.target.value)}
        >
          {sortedAddress.map((item) => (
            <option key={item.id} value={item.id} className="bg-zinc-900">
              {item.is_default ? "⭐ " : ""}
              {[item.house_number, item.street_name, item.ward, item.province].filter(Boolean).join(", ")}
            </option>
          ))}
        </select>
        
        <div className="mt-8 p-6 bg-zinc-950 border border-zinc-800 rounded-xl shadow-inner">
          <div className="flex items-center gap-4 mb-4">
             <div className="p-3 bg-white rounded-lg">
                <CreditCard className="text-black" size={24} />
             </div>
             <div>
                <p className="font-bold text-lg text-white">Thanh toán qua Stripe</p>
                <p className="text-sm text-zinc-400 text-zinc-500">Thanh toán an toàn bảo mật 100%</p>
             </div>
          </div>
          <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
            Bạn sẽ được chuyển sang cổng thanh toán Stripe để hoàn tất đơn hàng bằng thẻ Visa, Mastercard hoặc các phương thức quốc tế khác.
          </p>
          <div className="flex gap-2">
             <div className="h-6 w-10 bg-zinc-800 rounded flex items-center justify-center text-[10px] font-bold">VISA</div>
             <div className="h-6 w-10 bg-zinc-800 rounded flex items-center justify-center text-[10px] font-bold">MC</div>
             <div className="h-6 w-10 bg-zinc-800 rounded flex items-center justify-center text-[10px] font-bold">AMEX</div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Order Summary */}
      <div className="bg-zinc-900 p-8 rounded-2xl shadow-2xl border border-zinc-800 flex flex-col">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
          <ShoppingCart className="text-zinc-400" size={24} />
          Đơn hàng của bạn
        </h2>

        <div className="flex-1 space-y-4 overflow-y-auto max-h-[400px] pr-2 mb-6">
          {/* BUY NOW */}
          {type === "buyNow" && product && (
            <div className="flex items-center gap-4 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
              <div className="w-20 h-20 bg-zinc-900 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={product?.images?.[0]?.image_url}
                  alt={product?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white truncate">{product?.name}</p>
                <p className="text-zinc-400 text-sm">Số lượng: {quantity}</p>
                <p className="font-bold text-white mt-1">
                  ${((product.price_after ?? product.price) * quantity).toLocaleString()}
                </p>
              </div>
            </div>
          )}

          {/* CART */}
          {type === "cart" && cartItems.map((item) => (
            <div key={item.id} className="flex items-center gap-4 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
              <div className="w-20 h-20 bg-zinc-900 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={item?.image_url || item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white truncate">{item.product_name}</p>
                <p className="text-zinc-400 text-sm">Số lượng: {item.quantity}</p>
                <p className="font-bold text-white mt-1">
                  ${((item.price_after ?? item.price) * item.quantity).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 space-y-4">
          <div className="flex justify-between text-zinc-400">
            <span>Tạm tính</span>
            <span className="text-white">
              ${(type === "buyNow" ? (product?.price_after ?? product?.price) * quantity : summary.totalPrice)?.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between text-zinc-400">
            <span>Phí vận chuyển</span>
            <span className="text-emerald-400">Miễn phí</span>
          </div>

          <div className="border-t border-zinc-800 pt-4 flex justify-between text-2xl font-black">
            <span className="text-white">Tổng cộng</span>
            <span className="text-white">
              ${(type === "buyNow" ? (product?.price_after ?? product?.price) * quantity : summary.totalPrice)?.toLocaleString()}
            </span>
          </div>
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={loading}
          className="w-full mt-8 bg-white text-black py-4 rounded-xl font-black text-lg hover:bg-zinc-200 transition duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Đang xử lý...
            </>
          ) : (
            "Xác nhận & Thanh toán ngay"
          )}
        </button>
      </div>
    </div>
  );
}
