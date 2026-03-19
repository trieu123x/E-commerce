"use client";
import axios from "../api/axios";
import { useEffect, useState } from "react";
import banner1 from "../../../public/banner1.jpg";
import banner2 from "../../../public/banner2.jpg";
import banner3 from "../../../public/banner3.jpg";
import banner4 from "../../../public/banner4.jpg";
import banner5 from "../../../public/banner5.jpg";
import Link from "next/link";
export default function Banner() {
  const [categories, setCategories] = useState([]);
  const [current, setCurrent] = useState(0);
  const slides = [banner1, banner2, banner3, banner4, banner5];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/categories/parents");
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching parent categories:", error);
      }
    };

    fetchCategories();
  }, []);
    useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval); // cleanup
  }, [slides.length]);
  return (
    <>
      <div className="container pl-16  flex gap-5">
        <div className="w-68  border-r-2 border-gray-200 p-5 bg-white">
          {categories.map((cat) => (
            <Link
              href={`/products?category=${cat.id}`}
              key={cat.id}
              className="flex   justify-between items-center py-2 cursor-pointer hover:text-red-500 transition"
            >
              <span className="text-lg">{cat.name}</span>
            </Link>
          ))}
        </div>
        <div className="flex-1 pb-0.5 pt-7 pl-5">
  {/* Slide */}
  <div className="relative h-98 overflow-hidden">
    
    <img
      src={slides[current].src}
      alt={`Slide ${current + 1}`}
      className="w-full h-full object-cover transition-all duration-500"
    />

    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex space-x-3">
      {slides.map((_, index) => (
        <div
          key={index}
          onClick={() => setCurrent(index)}
          className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
            current === index
              ? "bg-red-500 scale-125"
              : "bg-white/70 hover:bg-white"
          }`}
        />
      ))}
    </div>
    
  </div>
</div>
      </div>
    </>
  );
}
