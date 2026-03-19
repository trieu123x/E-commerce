"use client";
import { Calendar, Heart, ArrowDownAZ, Star } from "lucide-react";
import { ArrowUp, ArrowDown } from "lucide-react";
import Select from "react-select";
import { useSearchParams } from "next/navigation";
export default function ProductFilter({ filters, setFilters, categories,sales }) {
  const searchParams = useSearchParams();
    const categoryFromUrl = searchParams.get("category");
    const options = [
    { key: "created_at", icon: <Calendar size={18} />, label: "Date" },
    { key: "likes", icon: <Heart size={18} />, label: "Likes" },
    { key: "name", icon: <ArrowDownAZ size={18} />, label: "Name" },
    { key: "rating", icon: <Star size={18} />, label: "Rating" },
    ];
   const handleSort = (field) => {
  setFilters(prev => ({
    ...prev,
    sortBy: field,
    sortOrder:
      prev.sortBy === field && prev.sortOrder === "DESC"
        ? "ASC"
        : "DESC"
  }));
    };
  return (
    <div className="sticky top-6 bg-gray-100  p-6 rounded-xl shadow space-y-6">
      {/* Search */}
      <div>
        <label className="font-semibold">Search</label>
        <input
          type="text"
          value={filters.search}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              search: e.target.value,
              page: 1,
            }))
          }
          className="w-full border p-2 rounded mt-2"
          placeholder="What are you looking for?"
        />
      </div>
      {/* Sort */}
      <div className="grid grid-cols-4 border rounded-xl overflow-hidden shadow-sm bg-white">
        {options.map((item) => (
          <button
            key={item.key}
            onClick={() =>
              {setFilters((prev) => ({
                ...prev,
                sortBy: item.key,
                page: 1,
              }))
                handleSort(item.key)}
            }
            className={`flex flex-col items-center justify-center gap-1 py-3 transition-all
            ${
              filters.sortBy === item.key
                ? "bg-red-500 text-white"
                : "bg-white hover:bg-gray-100 text-gray-600"
            } ${item.key === "rating" ? "rounded-r-xl" : ""}`}
          >
            {item.icon}
                <span className="text-xs font-medium">{item.label}</span>
                {filters.sortBy === item.key && (
        filters.sortOrder === "DESC"
          ? <ArrowDown size={16} />
          : <ArrowUp size={16} />
      )}
          </button>
        ))}
      </div>

      {/* Price filter */}
      <div>
        <label className="font-semibold">Value</label>
        <div className="flex gap-2 mt-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                minPrice: e.target.value,
                page: 1,
              }))
            }
            className="w-1/2 border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                maxPrice: e.target.value,
                page: 1,
              }))
            }
            className="w-1/2 border p-2 rounded"
          />
        </div>
      </div>

      {/* Category */}
      <Select
  options={[
    { value: "", label: "Tất cả" },
    ...categories.map((c) => ({
      value: c.id,
      label: c.name,
    })),
  ]}

  value={
    [
      { value: "", label: "Tất cả" },
      ...categories.map((c) => ({
        value: c.id,
        label: c.name,
      })),
    ].find(option => option.value === filters.category)
  }

  onChange={(selected) =>
    setFilters((prev) => ({
      ...prev,
      category: selected.value,
      page: 1,
    }))
  }
      />
      
      {/* Sale */}
<Select
  placeholder="Select sale"
  options={[
    { value: "", label: "None" },
    ...sales.map((s) => ({
      value: s.id,
      label: s.name,
    })),
  ]}
  value={
    [
      { value: "", label: "None" },
      ...sales.map((s) => ({
        value: s.id,
        label: s.name,
      })),
    ].find((option) => option.value === filters.sale)
  }
  onChange={(selected) =>
    setFilters((prev) => ({
      ...prev,
      sale: selected.value,
      page: 1,
    }))
  }
/>

      <button
        onClick={filters.onApply}
        className="w-full bg-red-500 text-white py-2 rounded"
      >
        Apply
      </button>
    </div>
  );
}
