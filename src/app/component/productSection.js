"use client";
import { Heart, Eye } from "lucide-react";
import ProductCard from "./productCard";




export default function ProductSection({ products }) {
  return (
    <section className=" container mx-auto py-10 ">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
                  <div className="flex flex-row items-center gap-4">
                      <div className=" w-4 h-12 rounded-sm bg-orange-600"></div>
            <p className="text-orange-600 text-xl font-bold">Our Products</p>
          </div>
          <h2 className="text-3xl font-bold">Explore Our Products</h2>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-4 gap-6">
        {products.slice(0, 8).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Button */}
      <div className="flex justify-center mt-10">
        <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded transition">
          View All Products
        </button>
      </div>
    </section>
  );
}
