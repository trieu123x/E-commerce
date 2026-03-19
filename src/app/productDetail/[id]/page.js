"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Minus, Plus, Heart, User, PencilLine } from "lucide-react";
import { Truck, RefreshCcw } from "lucide-react";
import instance from "@/app/api/axios";
import { useAuth } from "@/app/context/authContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

function StarRating({ rating = 0 }) {
  return (
    <div className="flex items-center gap-1 text-yellow-400 text-sm">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>{i < Math.round(rating) ? "★" : "☆"}</span>
      ))}
    </div>
  );
}

export default function ProductDetail() {
  const params = useParams();
  const id = params.id;
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const {
    setCartCount,
    setWishlistCount,
    wishlist,
    setWishlist,
    cart,
    setCart,
    user,
  } = useAuth();
  const [nonti, setNonti] = useState("Add to cart");
  const [showUpdateReview, setShowUpdateReview] = useState(false);
  const [error, setError] = useState();
  const [sale, setSale] = useState();
  useEffect(() => {
    fetchProduct();
    fetchReviews(id);
  }, [id]);
  console.log(product);
  const fetchProduct = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`);
      const data = await res.json();
      setProduct(data.product);
      setSelectedImage(data.product.images?.[0]?.image_url);
      setSale(data.product.saleName);
      if (data.product.category_id) {
        fetchRelated(data.product.category_id);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleSubmitReview = async () => {
    if (!rating) {
      setError("Select the star !");
      setTimeout(() => {
        setError();
      }, 3000);
      return;
    }

    try {
      setSubmitting(true);

      const res = await instance.post(`/products/${id}/reviews`, {
        rating: rating,
        comment: comment,
      });

      const data = res.data;

      if (data.success) {
        setReviews([...reviews, data.review]);
        setRating(0);
        setComment("");
      }
    } catch (err) {
      if (err.response?.status === 403) {
        setError("You have to buy the product first");
        setTimeout(() => {
          setError();
        }, 3000);
      }
      if (err.response?.status === 400) {
        setError("You can't add more review");
        setTimeout(() => {
          setError();
        }, 3000);
      }
    } finally {
      setSubmitting(false);
    }
  };
  const handleUpdateReview = async (reviewId) => {
    try {
      const res = await instance.put(`/products/${id}/reviews/${reviewId}`, {
        rating: rating,
        comment: comment,
      });
      const data = res.data;
      if (data.success) {
        setReviews((prev) =>
          prev.map((r) =>
            r.id === data.review.id ? { ...data.review, user: r.user } : r,
          ),
        );
        setRating(0);
        setComment("");
        setShowUpdateReview();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchRelated = async (categoryId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/products?category_id=${categoryId}`,
      );
      const data = await res.json();
      setRelatedProducts(data.data || []);
    } catch (err) {
      console.error(err);
    }
  };
  const fetchReviews = async () => {
    try {
      const res = await instance.get(`/products/${id}/reviews`);
      console.log(res);
      if (res.data.success) {
        res.data.reviews.sort((a, b) => {
          if (a.user?.id === user?.id) return -1;
          if (b.user?.id === user?.id) return 1;
          return 0;
        });
        setReviews(res.data.reviews);
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };

  const avgRating = useMemo(() => {
    if (!reviews.length) return 0;

    return reviews.reduce((sum, rev) => sum + rev.rating, 0) / reviews.length;
  }, [reviews]);

  const handleAddToCart = async () => {
    try {
      setCartCount((prev) => (prev += 1));
      setNonti("Success");
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

  const increase = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  const isInWishlist = wishlist.some((item) => item.product_id === id);

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

  if (!product) return <div className="p-10">Loading...</div>;

  return (
    <>
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="max-w-6xl mx-auto p-10 grid grid-cols-2 gap-12">
        {/* LEFT - IMAGES */}
        <div className="flex gap-4">
          {/* Thumbnail */}
          <div className="flex flex-col gap-4">
            {product.images?.map((img) => (
              <img
                key={img.id}
                src={img.image_url}
                onClick={() => setSelectedImage(img.image_url)}
                className={`w-20 h-20 object-cover border rounded cursor-pointer ${
                  selectedImage === img.image_url
                    ? "border-blue-500"
                    : "border-gray-200"
                }`}
              />
            ))}
          </div>

          {/* Main Image */}
          <div className="flex-1 h-112 bg-gray-100 p-6 rounded">
            <img src={selectedImage} className="w-full h-100 object-contain" />
          </div>
        </div>

        {/* RIGHT - INFO */}
        <div className="flex flex-col gap-5">
          <h1 className="text-2xl font-semibold">{product.name}</h1>
          {sale && (
            <div className="w-fit bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-md ">
              {sale}
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <StarRating rating={avgRating}></StarRating>
            <span>{reviews.length} Reviews</span>
            <span className="text-green-500">
              | {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          {sale ? (
            <>
              <div className="flex flex-col items-left gap-2">
                {product.price_after < product.price && (
                  <span className="text-gray-400 line-through text-xl">
                    $
                    {parseFloat(product.price).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                )}
                <span className="text-red-500 text-3xl font-bold">
                  $
                  {parseFloat(product.price_after).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="flex text-xl items-center gap-2 mb-1">
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

          <p className="text-gray-600 border-b pb-4">{product.description}</p>

          {/* Quantity + Buy */}
          <div className="flex items-center gap-4">
            <div className="flex items-center border rounded">
              <button
                onClick={decrease}
                className="px-3 py-2 border-r hover:bg-gray-100"
              >
                <Minus size={16} />
              </button>

              <span className="px-6">{quantity}</span>

              <button
                onClick={increase}
                className="px-3 py-2 border-l hover:bg-gray-100"
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              onClick={() => {
                router.push(
                  `/checkout?type=buyNow&product_id=${id}&quantity=${quantity}`,
                );
              }}
              className="bg-orange-600 text-white px-8 py-3 rounded cursor-pointer transition"
            >
              Buy Now
            </button>
            <button
              onClick={handleAddToCart}
              className="bg-green-500 text-white px-8 py-3 rounded hover:bg-red-600 transition"
            >
              {nonti}
            </button>
            <button
              onClick={handleWishlistToggle}
              className={`border-2  p-3 rounded-xl hover:text-red-500 ${
                isInWishlist
                  ? "bg-red-100 text-red-500 border-red-500"
                  : "bg-white text-gray-600 border-gray-500 hover:bg-gray-100"
              }`}
            >
              <Heart size={18} />
            </button>
          </div>

          {/* Shipping box */}
          <div className="border rounded p-4 mt-6 flex flex-col gap-4">
            <div className="flex  items-center gap-3">
              <Truck className="w-6 h-6 text-gray-700" />
              <div>
                <p className="font-medium">Free Delivery</p>
                <p className="text-sm text-gray-500">
                  Enter your postal code for Delivery Availability
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <RefreshCcw className="w-6 h-6 text-gray-700" />
              <div>
                <p className="font-medium">Return Delivery</p>
                <p className="text-sm text-gray-500">
                  Free 30 Days Delivery Returns
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* REVIEWS + RELATED */}
      <div className="max-w-6xl pb-4 mx-auto px-10 mt-16 grid grid-cols-3 gap-10">
        {/* LEFT - REVIEWS */}
        <div className="col-span-2 flex bg-gray-50 p-4 flex-col gap-6">
          {/* REVIEW SUMMARY */}
          <div className="   ">
            <h2 className="text-xl font-semibold mb-6">ĐÁNH GIÁ SẢN PHẨM</h2>

            <div className="flex gap-12 bg-red-50 pt-2 pb-2 rounded-xl border border-red-200 items-center">
              {/* LEFT - AVG SCORE */}
              <div className="flex flex-col items-center justify-center min-w-40">
                <p className="text-4xl font-bold text-red-500">
                  {avgRating.toFixed(1)}
                  <span className="text-lg text-gray-500"> trên 5</span>
                </p>

                <StarRating rating={avgRating} />

                <p className="text-sm text-gray-500 mt-1">
                  {reviews.length} đánh giá
                </p>
              </div>

              {/* RIGHT - FILTER BUTTONS */}
              <div className="flex flex-wrap gap-3">
                <button className="px-4 py-2 border rounded bg-red-50 text-red-500 border-red-400">
                  Tất Cả ({reviews.length})
                </button>

                {[5, 4, 3, 2, 1].map((star) => {
                  const count = reviews.filter((r) => r.rating === star).length;

                  return (
                    <button
                      key={star}
                      className="px-4 py-2 bg-gray-300  hover:border-red-400 hover:text-red-500 transition"
                    >
                      {star} Sao ({count})
                    </button>
                  );
                })}

                <button className="px-4 py-2 border rounded hover:border-red-400 hover:text-red-500 transition">
                  Có Bình Luận ({reviews.filter((r) => r.comment).length})
                </button>
              </div>
            </div>
          </div>
          {/* WRITE REVIEW */}
          <div className=" rounded-lg p-6 mt-6 flex flex-col gap-4">
            <h3 className="font-semibold text-lg">Viết đánh giá của bạn</h3>

            {/* Star Select */}
            <div className="flex gap-2 text-2xl cursor-pointer">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className={
                    (hover || rating) >= star
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }
                >
                  ★
                </span>
              ))}
            </div>

            {/* Textarea */}
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
              className="border rounded p-3 resize-none focus:outline-none focus:ring-2 focus:ring-red-400"
              rows={4}
            />

            {/* Submit Button */}
            <button
              onClick={handleSubmitReview}
              disabled={submitting}
              className="self-start bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition disabled:opacity-50"
            >
              {submitting ? "Đang gửi..." : "Gửi đánh giá"}
            </button>
          </div>
          {reviews.length === 0 && (
            <p className="text-gray-500">No reviews yet.</p>
          )}
          {showUpdateReview && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-[500px] flex flex-col gap-4">
                <h3 className="font-semibold text-lg">
                  Chỉnh sửa đánh giá của bạn
                </h3>

                {/* Star Select */}
                <div className="flex gap-2 text-2xl cursor-pointer">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                      className={
                        (hover || rating) >= star
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>

                {/* Textarea */}
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
                  className="border rounded p-3 resize-none focus:outline-none focus:ring-2 focus:ring-red-400"
                  rows={4}
                />

                {/* Submit Button */}
                <div className="gap-4 flex">
                  <button
                    onClick={() => {
                      setShowUpdateReview(false);
                    }}
                    className="self-start bg-gray-300  px-6 py-2 rounded hover:bg-gray-600 transition disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handleUpdateReview(showUpdateReview);
                    }}
                    disabled={submitting}
                    className="self-start bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition disabled:opacity-50"
                  >
                    {submitting ? "Đang gửi..." : "Gửi đánh giá"}
                  </button>
                </div>
              </div>
            </div>
          )}
          {reviews?.map((review) => (
            <div
              key={review.id}
              className="border-b-2 relative border-gray-400  p-4 flex flex-col gap-2"
            >
              {/* Top row */}
              <div className="flex items-center gap-3">
                <User className="w-8 h-8 text-gray-500" />
                {review?.user?.id === user?.id && user && (
                  <>
                    <PencilLine
                      onClick={() => {
                        setComment(review.comment);
                        setRating(review.rating);
                        setShowUpdateReview(review.id);
                      }}
                      className="absolute top-6 text-gray-500 right-2"
                    ></PencilLine>
                  </>
                )}

                <div>
                  <StarRating rating={review.rating} />
                  <p className="text-sm font-medium">
                    {review.user?.full_name || "Anonymous"}
                  </p>
                </div>
              </div>

              {/* Content */}
              <p className="text-gray-600 text-sm">{review.comment}</p>
            </div>
          ))}
        </div>

        {/* RIGHT - RELATED PRODUCTS */}
        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-semibold border-b pb-3">
            Related Products
          </h2>

          {relatedProducts
            .filter((item) => item.id !== product.id)
            .map((item) => (
              <Link
                key={item.id}
                href={`/productDetail/${item.id}`}
                className="flex items-center gap-3 border rounded p-3 hover:shadow hover:border-red-400 cursor-pointer transition"
              >
                <img
                  src={item.images?.[0]?.image_url || item.main_image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />

                <div className="flex flex-col flex-1">
                  <p className="text-sm font-medium hover:text-red-500 transition">
                    {item.name}
                  </p>
                  <p className="text-sm text-red-500">
                    $
                    {parseFloat(item.price).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </>
  );
}
