"use client";
import Pagination from "./components/pagination";
import ProductFilter from "./components/productFilter";
import ProductGrid from "./components/productGrid";
import { useAuth } from "../context/authContext";
import { useState, useEffect } from "react";
import PaginationBar from "./components/paginationBar";
import { useSearchParams, useSelectedLayoutSegment } from "next/navigation";
import instance from "../api/axios.js";
export default function Products() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category");
  const { categories } = useAuth();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilter, setShowFilter] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    minPrice: "",
    maxPrice: "",
    category: "",
    sortBy: "created_at",
    sortOrder: "DESC",
    sale: "",
  });
  const [sales, setSales] = useState([]);
  useEffect(() => {
    fetchSales();
  }, []);
  console.log(sales);
  // Fetch khi page hoặc filter thay đổi
  useEffect(() => {
    fetchProducts();
  }, [
    page,
    filters.search,
    filters.minPrice,
    filters.maxPrice,
    filters.category,
    filters.sortBy,
    filters.sortOrder,
    filters.sale
  ]);
  useEffect(() => {
    if (categoryFromUrl) {
      setFilters((prev) => ({
        ...prev,
        category: categoryFromUrl,
      }));
    }
  }, [categoryFromUrl]);

  async function fetchProducts() {
    try {
      const res = await instance.get(
        `/products?page=${page}&search=${filters.search}&min_price=${filters.minPrice}&max_price=${filters.maxPrice}&category_id=${filters.category}&sort_by=${filters.sortBy}&sort_order=${filters.sortOrder}&sale=${filters.sale}`,
      );

      if (res.data.success) {
        setProducts(res.data.data);

        setTotalPages(res.data.pagination.total_pages);
      }
    } catch (error) {
      console.error("Fetch products error:", error);
    }
  }
  async function fetchSales() {
    try {
      const res = await instance.get("/sales/active");
      if (res.data.success) {
        console.log(res.data);
        setSales(res.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="container mx-auto px-6 py-10">
      {/* Top Bar */}
      <PaginationBar
        page={page}
        totalPages={totalPages}
        setPage={setPage}
        showFilter={showFilter}
        setShowFilter={setShowFilter}
      />

      <div className="flex gap-8 mt-6">
        <div className={`${showFilter ? "w-3/4" : "w-full"}`}>
          <ProductGrid products={products} />
        </div>
        {showFilter && (
          <div className="w-1/4">
            <ProductFilter
              filters={filters}
              setFilters={setFilters}
              categories={categories}
              setPage={setPage}
              sales={sales}
            />
          </div>
        )}
      </div>
    </div>
  );
}
