"use client";

import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

export default function CompletedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 text-center shadow-2xl max-w-md w-full animate-fadeIn">

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <CheckCircle
            size={90}
            className="text-green-500 drop-shadow-lg animate-bounce"
          />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-white mb-3">
          Order Successful!
        </h1>

        {/* Description */}
        <p className="text-gray-400 mb-8">
          Thank you for your purchase. Your order has been placed successfully.
        </p>

        {/* Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => router.push("/")}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-semibold hover:scale-105 transition duration-300 shadow-lg hover:shadow-orange-500/40"
          >
            Back to Home
          </button>

          <button
            onClick={() => router.push("/products")}
            className="w-full border border-orange-500 text-orange-500 py-3 rounded-lg font-semibold hover:bg-orange-500 hover:text-white transition duration-300"
          >
            Continue Shopping
          </button>
        </div>
      </div>

      {/* Custom animation */}
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-in-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}