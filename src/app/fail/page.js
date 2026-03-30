"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { XCircle } from "lucide-react";
import { Suspense } from "react";

function FailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 text-center shadow-2xl max-w-md w-full animate-fadeIn">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <XCircle
            size={90}
            className="text-red-500 drop-shadow-lg animate-pulse"
          />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-white mb-3">
          Payment Failed
        </h1>

        {/* Description */}
        <p className="text-gray-400 mb-8">
          {orderId 
            ? `Something went wrong with your payment for order #${orderId}. Please try again or choose another payment method.`
            : "Something went wrong with your payment. Please try again or contact support."}
        </p>

        {/* Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => router.push("/cart")}
            className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-3 rounded-lg font-semibold hover:scale-105 transition duration-300 shadow-lg hover:shadow-red-500/40"
          >
            Return to Cart
          </button>

          <button
            onClick={() => router.push("/")}
            className="w-full border border-zinc-700 text-gray-300 py-3 rounded-lg font-semibold hover:bg-zinc-800 hover:text-white transition duration-300"
          >
            Back to Home
          </button>
        </div>
      </div>

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

export default function FailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FailContent />
    </Suspense>
  );
}
