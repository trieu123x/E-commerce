"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/authContext";
import ProductCard from "./components/productCard.js";
export default function WishlistPage() {
  const { wishlist , categories = [] } = useAuth();
  const [expanded, setExpanded] = useState({});

  // Lấy parent categories
  const parentCategories = useMemo(() => {
    return categories.filter((c) => !c.parent_id);
  }, [categories]);

  // Lấy child theo parent
  const getChildren = (parentId) => {
    return categories.filter(
      (c) => String(c.parent_id) === String(parentId)
    );
  };
 
  // Lấy wishlist theo category
  const getWishlistByCategory = (categoryId) => {
    return wishlist.filter(
      (item) =>
        String(item?.product?.category_id) === String(categoryId)
    );
  };
  

  const toggleExpand = (categoryId) => {
    setExpanded((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  if (!categories.length) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        Loading...
      </div>
    );
  }
  return (
    <div className="bg-gray-100 min-h-screen py-10 px-6">
      <div className="max-w-7xl mx-auto space-y-10">
        {parentCategories.map((parent) => {
          const children = getChildren(parent.id);

          return (
            <div key={parent.id}>
              {/* Parent Title */}
              <h2 className="text-2xl font-bold mb-6">
                {parent.name}
              </h2>

              {[parent, ...children].map((child) => {
                const items = getWishlistByCategory(child.id);

                if (!items.length) return null;

                const isExpanded = expanded[child.id];

                return (
                  <div key={child.id} className="mb-8">
                    {/* Child Title */}
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">
                        {child.name}
                      </h3>

                      {!isExpanded && items.length > 4 && (
                        <button
                          onClick={() =>
                            toggleExpand(child.id)
                          }
                          className="text-red-500 hover:underline"
                        >
                          See all
                        </button>
                      )}
                    </div>

                    {/* Product Grid */}
                    <motion.div
                      layout
                      className="grid grid-cols-2 md:grid-cols-4 gap-6 overflow-hidden"
                    >
                      <AnimatePresence>
                        {(isExpanded
                          ? items
                          : items.slice(0, 4)
                                ).map(item => (
                            <ProductCard key={item.id} item= {item}></ProductCard>
                        ))}
                      </AnimatePresence>
                    </motion.div>

                    {/* Hide button */}
                    {isExpanded && (
                      <div className="mt-4 text-right">
                        <button
                          onClick={() =>
                            toggleExpand(child.id)
                          }
                          className="text-gray-600 hover:underline"
                        >
                          Hide
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}