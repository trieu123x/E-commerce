"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { Heart, Eye } from "lucide-react";
import instance from "../api/axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
function StarRating({ rating = 0 }) {
  return (
    <div className="flex items-center gap-1 text-yellow-400 text-sm">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>{i < Math.round(rating) ? "★" : "☆"}</span>
      ))}
    </div>
  );
}

export default function ProductCard({ product }) {
  const router = useRouter();
  const { wishlist, setWishlist } = useAuth();
  const [nonti, setNonti] = useState("Add To Cart");
  const [sale, setSale] = useState();
  const { wishlistCount, setWishlistCount, setCartCount, cart, setCart } =
    useAuth();

  useEffect(() => {
    if (product.price_after != product.price) setSale(true);
  }, []);
  const isInWishlist = wishlist.some((item) => item.product_id === product.id);

  const handleWishlistToggle = async () => {
    try {
      if (isInWishlist) {
        await instance.delete(`/wishlist/${product.id}`);

        setWishlist((prev) =>
          prev.filter((item) => item.product_id !== product.id),
        );
      } else {
        const res = await instance.post("/wishlist", {
          product_id: product.id,
        });

        if (res.data.success) {
          console.log(res.data);
          setWishlistCount((prev) => prev + 1);
          setWishlist((prev) => [
            ...prev,
            {
              ...res.data.wishlist,
              product: product,
            },
          ]);
        }
      }
    } catch (error) {
      console.error("Wishlist error:", error);
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
      if (res.data.success) {
        const newItem = res.data.cartItem;

        setCart((prevCart) => {
          if (!prevCart) return prevCart;

          // Kiểm tra sản phẩm đã tồn tại chưa
          const existingItem = prevCart.items.find(
            (item) => item.product_id === newItem.product_id,
          );

          let updatedItems;

          if (existingItem) {
            // Update item
            updatedItems = prevCart.items.map((item) =>
              item.product_id === newItem.product_id
                ? newItem // dùng dữ liệu server trả về
                : item,
            );
          } else {
            // Thêm item mới
            updatedItems = [...prevCart.items, newItem];
          }

          // Tính lại summary
          const totalQuantity = updatedItems.reduce(
            (sum, item) => sum + item.quantity,
            0,
          );

          const totalPrice = updatedItems.reduce(
            (sum, item) => sum + item.total,
            0,
          );

          return {
            ...prevCart,
            items: updatedItems,
            summary: {
              totalItems: updatedItems.length,
              totalQuantity,
              totalPrice,
            },
          };
        });
      }
    } catch (error) {
      console.log("Cart error:", error.response?.data || error.message);
    }

  };

  return (
    <>
      <div
        onClick={() => {
          router.push(`productDetail/${product.id}`);
        }}
        className="group border border-gray-100 shadow-xl bg-white p-4 rounded-lg relative hover:shadow-lg transition"
      >
        {sale && (
          <>
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-md z-10">
              SALE
            </div>
          </>
        )}
        {/* Icon right */}
        <div className="absolute cursor-pointer top-3 right-3 flex flex-col gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleWishlistToggle();
            }}
            className={`p-2 rounded-full z-9 shadow transition 
            ${
              isInWishlist
                ? "bg-red-100 text-red-500"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Heart size={16} fill={isInWishlist ? "currentColor" : "none"} />
          </button>
          <button className="bg-white p-2 z-9 rounded-full shadow hover:bg-gray-100">
            <Eye size={16} />
          </button>
        </div>

        {/* Image */}
        <div className="relative h-48 bg-gray-100 mb-4 overflow-hidden">
          <img
            src={product.main_image || (product.images && product.images[0] ? product.images[0].image_url : "/placeholder.png")}
            alt={product.name}
            className="absolute cursor-pointer inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />

          {/* Add to cart hover */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
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
        <h3 className="text-sm font-semibold mb-1">{product.name}</h3>
        {sale ? (
          <>
            <div className="flex flex-col items-left gap-2">
              <span className="text-red-500 font-bold">
                ${parseFloat(product.price_after).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>

              {product.price_after < product.price && (
                <span className="text-gray-400 line-through text-sm">
                  ${parseFloat(product.price).toLocaleString("en-US", {
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
                {parseFloat(product.price).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </>
        )}

        <div className="flex items-center gap-2">
          <StarRating rating={product.rating} />
          <span className="text-gray-500 text-sm">
            ({product.review_count || 0})
          </span>
        </div>
      </div>
    </>
  );
}
