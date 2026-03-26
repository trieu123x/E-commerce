"use client";
import { useEffect, useState } from "react";
import instance from "@/app/api/axios";

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [saleSearchTerm, setSaleSearchTerm] = useState("");
  const [manageSale, setManageSale] = useState(null);
    const [saleProducts, setSaleProducts] = useState([]);
    const [non,setNon] = useState()
  const [form, setForm] = useState({
    name: "",
    discount_type: "percent",
    discount_value: "",
    start_date: "",
    end_date: "",
  });
  const getPagination = () => {
    const delta = 2; // số page hiển thị quanh page hiện tại
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, page - delta);
      i <= Math.min(totalPages - 1, page + delta);
      i++
    ) {
      range.push(i);
    }

    if (page - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (page + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return [...new Set(rangeWithDots)];
  };
console.log(sales)
  const fetchSales = async () => {
    const res = await instance.get("/admin/sales");
    setSales(res.data.data);
  };
  const fetchSaleProducts = async (saleId) => {
    const res = await instance.get(`/admin/sales/${saleId}`);
    setSaleProducts(res.data.data.products);
  };
  const fetchProducts = async (pageNumber = 1, search = "") => {
    const res = await instance.get("/products", {
      params: {
        page: pageNumber,
        limit: 20,
        search: search,
      },
    });
      console.log(res.data)

    setProducts(res.data.data);
    setTotalPages(res.data.pagination.total_pages);
  };
  useEffect(() => {
    fetchSales();
  }, []);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    fetchProducts(page, debouncedSearch);
  }, [page, debouncedSearch]);

  const handleCreate = async (e) => {
    e.preventDefault();

    const res = await instance.post("/admin/sales", form);

    const saleId = res.data.data.id;

    if (selectedProducts.length > 0) {
      await instance.post(`/admin/sales/${saleId}/products`, {
        productIds: selectedProducts,
      });
    }

    setSelectedProducts([]);
    fetchSales();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete sale?")) return;

    await instance.delete(`/admin/sales/${id}`);
    fetchSales();
  };

  const addProductToSale = async (productId) => {
    await instance.post(`/admin/sales/${manageSale.id}/products`, {
      productIds: [productId],
    });

    fetchSaleProducts(manageSale.id);
  };
  const saleProductIds = saleProducts.map((p) => p.id);

  const productsNotInSale = products.filter(
    (p) => !saleProductIds.includes(p.id),
  );
  const filteredSaleProducts = saleProducts.filter((p) =>
    p.name.toLowerCase().includes(saleSearchTerm.toLowerCase()),
  );
  const removeProductFromSale = async (productId) => {
    await instance.delete(`/admin/sales/${manageSale.id}/${productId}`);

    fetchSaleProducts(manageSale.id);
  };
  return (
    <div className="p-6 space-y-10">
      <h1 className="text-2xl font-bold">Quản lí giảm giá</h1>

      {/* CREATE SALE */}

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Create Sale</h2>

        <form onSubmit={handleCreate} className="grid grid-cols-2 gap-4">
          <input
            className="border p-2 rounded"
            placeholder="Sale name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            type="number"
            className="border p-2 rounded"
            placeholder="Discount value"
            onChange={(e) =>
              setForm({ ...form, discount_value: e.target.value })
            }
          />

          <select
            className="border p-2 rounded"
            onChange={(e) =>
              setForm({ ...form, discount_type: e.target.value })
            }
          >
            <option value="percent">Percent</option>
            <option value="fixed">Fixed</option>
          </select>

          <input
            type="date"
            className="border p-2 rounded"
            onChange={(e) => setForm({ ...form, start_date: e.target.value })}
          />

          <input
            type="date"
            className="border p-2 rounded"
            onChange={(e) => setForm({ ...form, end_date: e.target.value })}
          />

          <button className="col-span-2 bg-blue-600 text-white py-2 rounded">
            Create Sale
          </button>
        </form>
      </div>

      {/* SELECT PRODUCTS */}

      {/* SALE LIST */}

      <div className="bg-white rounded shadow">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Name</th>
              <th>Discount</th>
              <th>Start</th>
              <th>End</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
           {sales.map((sale) => (
  <tr
    key={sale.id}
    className="border-b hover:bg-gray-50 transition"
  >
    {/* NAME */}
    <td className="p-4 font-medium text-gray-800">
      {sale.name}
    </td>

    {/* DISCOUNT */}
    <td>
      {sale.discount_type === "percent" ? (
        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
          {sale.discount_value}%
        </span>
      ) : (
        <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
          ${sale.discount_value}
        </span>
      )}
    </td>

    {/* START DATE */}
    <td className="text-gray-600">
      {new Date(sale.start_date).toLocaleDateString()}
    </td>

    {/* END DATE */}
    <td className="text-gray-600">
      {new Date(sale.end_date).toLocaleDateString()}
    </td>

    {/* STATUS */}
    <td>
      {sale.is_active ? (
        <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
          Active
        </span>
      ) : (
        <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm">
          Inactive
        </span>
      )}
    </td>

    {/* ACTIONS */}
    <td>
      <div className="flex gap-2">

        <button
          onClick={() => {
            setManageSale(sale);
            fetchSaleProducts(sale.id);
          }}
          className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1.5 rounded-lg text-sm"
        >
          Manage
        </button>

        <button
          onClick={() => handleDelete(sale.id)}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm"
        >
          Delete
        </button>

      </div>
    </td>
  </tr>
))}
          </tbody>
        </table>
        {manageSale && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white w-225 max-h-[91vh]  rounded-xl shadow-lg p-6">
              {/* HEADER */}

              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">
                  Manage Sale: {manageSale.name}
                </h2>

                <button
                  onClick={() => setManageSale(null)}
                  className="text-gray-500 hover:text-black"
                >
                  ✕
                </button>
              </div>

              {/* EDIT SALE INFO */}

              <div className="grid grid-cols-2 gap-4 mb-8">
                <input
                  className="border p-2 rounded"
                  value={manageSale.name}
                  onChange={(e) =>
                    setManageSale({ ...manageSale, name: e.target.value })
                  }
                  placeholder="Sale name"
                />

                <input
                  type="number"
                  className="border p-2 rounded"
                  value={manageSale.discount_value}
                  onChange={(e) =>
                    setManageSale({
                      ...manageSale,
                      discount_value: e.target.value,
                    })
                  }
                  placeholder="Discount value"
                />

                <select
                  className="border p-2 rounded"
                  value={manageSale.discount_type}
                  onChange={(e) =>
                    setManageSale({
                      ...manageSale,
                      discount_type: e.target.value,
                    })
                  }
                >
                  <option value="percent">Percent</option>
                  <option value="fixed">Fixed</option>
                </select>

                <input
                  type="date"
                  className="border p-2 rounded"
                  value={manageSale.start_date?.slice(0, 10)}
                  onChange={(e) =>
                    setManageSale({
                      ...manageSale,
                      start_date: e.target.value,
                    })
                  }
                />

                <input
                  type="date"
                  className="border p-2 rounded"
                  value={manageSale.end_date?.slice(0, 10)}
                  onChange={(e) =>
                    setManageSale({
                      ...manageSale,
                      end_date: e.target.value,
                    })
                  }
                />

                <select
                  className="border p-2 rounded"
                  value={manageSale.is_active === true ? "true" : "false"}
                  onChange={(e) =>
                    setManageSale({
                      ...manageSale,
                      is_active: e.target.value === "true",
                    })
                  }
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>

                <button
                  onClick={async () => {
                    await instance.put(
                      `/admin/sales/${manageSale.id}`,
                      manageSale,
                    );
                    fetchSales();
                    alert("Sale updated");
                  }}
                  className="col-span-2 bg-blue-600 text-white py-2 rounded"
                >
                  Save Changes
                </button>
              </div>

              {/* PRODUCT MANAGER */}

              <div className="grid grid-cols-2 gap-6">
                {/* PRODUCT NOT IN SALE */}

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold">Available Products</h3>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search products..."
                        className="border rounded-lg pl-8 pr-3 py-1.5 text-sm w-64 focus:ring-2 focus:ring-blue-500 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <svg
                        className="w-4 h-4 absolute left-2.5 top-2.5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {productsNotInSale.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between border p-3 rounded hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={p.main_image}
                            className="w-12 h-12 object-cover rounded"
                          />

                          <div>
                            <div className="text-sm font-medium">{p.name}</div>

                            <div className="text-gray-500 text-sm">
                              ${Number(p.price).toLocaleString()}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => addProductToSale(p.id)}
                          className="text-blue-500 text-sm font-medium"
                        >
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center mt-6">
                    <div className="flex gap-2 items-center">
                      <button
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                      >
                        Prev
                      </button>

                      {getPagination().map((p, i) =>
                        p === "..." ? (
                          <span key={i} className="px-2">
                            ...
                          </span>
                        ) : (
                          <button
                            key={i}
                            onClick={() => setPage(p)}
                            className={`px-3 py-1 rounded ${
                              page === p ? "bg-blue-500 text-white" : "border"
                            }`}
                          >
                            {p}
                          </button>
                        ),
                      )}

                      <button
                        onClick={() => setPage(page + 1)}
                        disabled={page === totalPages}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>

                {/* PRODUCT IN SALE */}

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold">Products in Sale</h3>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Filter products in sale..."
                        className="border rounded-lg pl-8 pr-3 py-1.5 text-sm w-64 focus:ring-2 focus:ring-red-500 outline-none"
                        value={saleSearchTerm}
                        onChange={(e) => setSaleSearchTerm(e.target.value)}
                      />
                      <svg
                        className="w-4 h-4 absolute left-2.5 top-2.5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {filteredSaleProducts.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between border p-3 rounded hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images?.[0]?.image_url}
                            className="w-12 h-12 object-cover rounded"
                          />

                          <div>
                            <div className="text-sm font-medium">{p.name}</div>

                            <div className="text-sm">
                              <span className="line-through text-gray-400 mr-2">
                                ${Number(p.price).toLocaleString()}
                              </span>

                              <span className="text-red-500 font-semibold">
                                ${Number(p.price_after).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => removeProductFromSale(p.id)}
                          className="text-red-500 text-sm font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
