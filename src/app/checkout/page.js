"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import instance from "@/app/api/axios";

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const id = searchParams.get("product_id");
  const quantity = parseInt(searchParams.get("quantity") || 1);
  const type = searchParams.get("type");
  const handleSubmit = async () => {
    if (type === "buyNow")
      router.push(
        `/order?type=buyNow&product_id=${id}&quantity=${quantity}&payment=${paymentMethod}`,
      );
    else if (type === "cart")
      router.push(`/order?type=cart&payment=${paymentMethod}`);
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Chọn phương thức thanh toán</h1>

      <div className="space-y-4">
        {/* COD */}
        <div
          onClick={() => setPaymentMethod("COD")}
          className={`border rounded-xl p-4 cursor-pointer transition ${
            paymentMethod === "COD"
              ? "border-black bg-gray-100"
              : "border-gray-300"
          }`}
        >
          <div className="flex items-center gap-3">
            <input type="radio" checked={paymentMethod === "COD"} readOnly />
            <div>
              <p className="font-semibold">Thanh toán khi nhận hàng (COD)</p>
              <p className="text-sm text-gray-500">
                Thanh toán bằng tiền mặt khi nhận hàng
              </p>
            </div>
          </div>
        </div>

       
        <div
          onClick={() => setPaymentMethod("VISA")}
          className={`border rounded-xl p-4 cursor-pointer transition ${
            paymentMethod === "VISA"
              ? "border-black bg-gray-100"
              : "border-gray-300"
          }`}
        >
          <div className="flex items-center gap-3">
            <input type="radio" checked={paymentMethod === "VISA"} readOnly />
            <div>
              <p className="font-semibold">Thanh toán bằng thẻ VISA</p>
              <p className="text-sm text-gray-500">Thanh toán qua thẻ VISA</p>
            </div>
          </div>
        </div>

        {/* MOMO */}
        <div
          onClick={() => setPaymentMethod("MOMO")}
          className={`border rounded-xl p-4 cursor-pointer transition ${
            paymentMethod === "MOMO"
              ? "border-black bg-gray-100"
              : "border-gray-300"
          }`}
        >
          <div className="flex items-center gap-3">
            <input type="radio" checked={paymentMethod === "MOMO"} readOnly />
            <div>
              <p className="font-semibold">Thanh toán qua Ví MoMo</p>
              <p className="text-sm text-gray-500">
                Quét mã QR bằng ứng dụng MoMo
              </p>
            </div>
          </div>
        </div>

        {/* VNPAY */}
        <div
          onClick={() => setPaymentMethod("VNPAY")}
          className={`border rounded-xl p-4 cursor-pointer transition ${
            paymentMethod === "VNPAY"
              ? "border-black bg-gray-100"
              : "border-gray-300"
          }`}
        >
          <div className="flex items-center gap-3">
            <input type="radio" checked={paymentMethod === "VNPAY"} readOnly />
            <div>
              <p className="font-semibold">Thanh toán qua VNPay</p>
              <p className="text-sm text-gray-500">
                Thanh toán qua cổng ATM/Internet Banking/QR Code
              </p>
            </div>
          </div>
        </div>

        {/* STRIPE */}
        <div
          onClick={() => setPaymentMethod("STRIPE")}
          className={`border rounded-xl p-4 cursor-pointer transition ${
            paymentMethod === "STRIPE"
              ? "border-black bg-gray-100"
              : "border-gray-300"
          }`}
        >
          <div className="flex items-center gap-3">
            <input type="radio" checked={paymentMethod === "STRIPE"} readOnly />
            <div>
              <p className="font-semibold">Thanh toán qua Stripe</p>
              <p className="text-sm text-gray-500">
                Thanh toán an toàn qua thẻ quốc tế (Credit/Debit Card)
              </p>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full mt-6 bg-black text-white py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50"
      >
        {loading ? "Đang xử lý..." : "Xác nhận đặt hàng"}
      </button>
    </div>
  );
}
