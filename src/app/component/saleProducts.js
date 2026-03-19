"use client";
import { Heart, Eye } from "lucide-react";
import ProductCard from "./productCard";
import { useState, useEffect } from "react";
import instance from "../api/axios";
import Countdown from "./countDown.js";
export default function ProductSection() {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    fetchSales();
  }, []);
  const fetchSales = async () => {
    try {
      const res = await instance.get("/sales/active");
      if (res.data.success) {
        console.log(res.data);
        setSales(res.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <section className=" container mx-auto py-10 ">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="flex flex-row items-center gap-4">
            <div className=" w-4 h-12 rounded-sm bg-orange-600"></div>
            <p className="text-orange-600 text-xl font-bold">Flash Sales</p>
          </div>
        </div>
      </div>
      {sales.map((sale) => (
        <div key={sale.id} className="mb-10">
          {/* Sale name */}
          <div className="flex flex-row gap-16 items-center mb-4">
            <h2 className="text-3xl font-bold mb-6">{sale.name}</h2>
<span className="ml-2 px-2 py-1 text-xl font-bold rounded bg-linear-to-r from-red-500 via-orange-500 to-yellow-500 text-white animate-[pulse_1.5s_infinite]">
  - {sale.discount_value} {sale.discount_type === "percent"? (<>%</>):(<>$</>)}
</span>
            <Countdown endDate={sale.end_date}></Countdown>
          </div>
          {/* Products grid */}
          <div className="grid grid-cols-4 gap-6">
            {sale.products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      ))}

      {/* Button */}
      <div className="flex justify-center mt-10">
        <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded transition">
          View All Products
        </button>
      </div>
    </section>
  );
}
