"use client";
import { useState } from "react";
import { useAuth } from "../../context/authContext";
import { Trash2 } from "lucide-react";
import instance from "../../api/axios"

function StarRating({ rating = 0 }) {
  return (
    <div className="flex items-center gap-1 text-yellow-400 text-sm">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>{i < Math.round(rating) ? "★" : "☆"}</span>
      ))}
    </div>
  );
}

export default function WishlistCard({ item }) {
  const { wishlist, setWishlist, wishlistCount, setWishlistCount,setCartCount } = useAuth();
  const [loading, setLoading] = useState(false);
  const[nonti,setNonti] = useState("Add To Cart")
  const product = item.product;

  const handleRemove = async () => {
    try {
      setLoading(true);

      await instance.delete(`/wishlist/${product.id}`);

      // cập nhật state local
      setWishlist(prev =>
        prev.filter(w => w.product_id !== product.id)
      );

     

    } catch (error) {
      console.error("Remove wishlist error:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleAddToCart = async () => {
    try {
      setCartCount((prev) => (prev += 1));
      setNonti("Added to your cart");
      setTimeout(() => {
        setNonti("Add To Cart");
      }, 3000);
      const res = await instance.post("/cart/add", {
        productId: product.id,
        quantity: 1,
      });

      console.log(res.data);
    } catch (error) {
      console.log("Cart error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="group border border-gray-100 shadow-xl bg-white p-4 rounded-lg relative hover:shadow-lg transition">
      
      {/* Trash icon */}
      <div className="absolute z-9 top-3 right-3">
        <button
          onClick={handleRemove}
          disabled={loading}
          className="bg-white p-2 rounded-full shadow hover:bg-red-100 text-gray-600 hover:text-red-500 transition"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {product.saleName && (
        <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
          SALE
        </div>
      )}

      {/* Image */}
      <div className="relative h-48 bg-gray-100 mb-4 overflow-hidden">
        <img
          src={product.main_image}
          alt={product.name}
          className="absolute cursor-pointer inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />

        {/* Add to cart hover */}
        <button
          onClick={handleAddToCart}
          className="
        absolute bottom-0 left-0 w-full 
        bg-black text-white py-2
        translate-y-full
        group-hover:translate-y-0
        opacity-0 group-hover:opacity-100
        transition-all duration-300 ease-in-out
      "
        >
          {nonti}
        </button>
      </div>

      {/* Info */}
      <h3 className="text-sm font-semibold mb-1 truncate">
        {product.name}
      </h3>

      <div className="flex flex-col mb-2">
        {product.saleName && product.price_after < product.price ? (
          <div className="flex items-center gap-2">
            <span className="text-red-500 font-bold">
              ${parseFloat(product.price_after).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-gray-400 text-xs line-through">
              ${parseFloat(product.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        ) : (
          <span className="text-red-500 font-bold">
            ${parseFloat(product.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <StarRating rating={product.rating} />
        <span className="text-gray-500 text-sm">
          ({product.review_count || 0})
        </span>
      </div>
    </div>
  );
}