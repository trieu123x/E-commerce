"use client";
import { toast } from "@/app/component/Toast";
import { useEffect, useState } from "react";
import instance from "../../api/axios";
import { Star,Trash2, Edit, Plus, Image as ImageIcon, ChevronUp, ChevronDown } from "lucide-react";
import { fetchOrdersAndCalculateSales } from "../../utils/orderUtils";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("DESC");
  const [filterStatus, setFilterStatus] = useState("ACTIVE");
  const [salesMap, setSalesMap] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category_id: "",
    status: "ACTIVE",
  });
  const [imageFormData, setImageFormData] = useState({
    imageUrl: "",
    images: [],
  });
  const [stockData, setStockData] = useState({
    stock: "",
  });

  useEffect(() => {
    fetchCategories();
    // Lấy dữ liệu orders khi component mount
    loadSalesData();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, search, sortBy, sortOrder, filterStatus]);

  const loadSalesData = async () => {
    try {
      const data = await fetchOrdersAndCalculateSales();
      setSalesMap(data);
    } catch (error) {
      console.error("Error loading sales data:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await instance.get("/admin/categories");
      if (res.data.success) {
        setCategories(res.data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  console.log(products);
  
  const fetchProducts = async () => {
  try {
    setLoading(true);

    // map sort option
    let sortByParam = sortBy;

    if (sortBy === "rating") {
      sortByParam = "sold"; // backend sẽ sort theo sold_quantity
    }

    const res = await instance.get("/admin/products", {
      params: {
        page,
        limit,
        search: search || undefined,
        sort_by: sortByParam,
        sort_order: sortOrder,
        status: filterStatus || undefined,
      },
    });

    if (res.data.success) {
      setProducts(res.data.data);
      setTotal(res.data.pagination.total);
    }

  } catch (error) {
    console.error("Error fetching products:", error);
  } finally {
    setLoading(false);
  }
};

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc muốn ẩn sản phẩm này?")) return;
    try {
      await instance.delete(`/admin/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };


  const handleChangeStatus = async (id, newStatus) => {
    try {
      await instance.patch(`/admin/products/${id}/status`, { status: newStatus });
      fetchProducts();
    } catch (error) {
      console.error("Error changing status:", error);
      toast.error("Lỗi khi thay đổi trạng thái");
    }
  };

  const handleUpdateStock = async () => {
    if (!stockData.stock || isNaN(stockData.stock)) {
      toast.error("Vui lòng nhập số lượng hợp lệ");
      return;
    }
    try {
      await instance.put(`/admin/products/${selectedProduct.id}/stock`, {
        stock: parseInt(stockData.stock),
      });
      setShowStockModal(false);
      setStockData({ stock: "" });
      fetchProducts();
    } catch (error) {
      console.error("Error updating stock:", error);
      toast.error("Lỗi khi cập nhật kho");
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price,
      stock: product.stock,
      category_id: product.category_id,
      status: product.status || "ACTIVE",
    });
    setShowModal(true);
  };

  const handleImageModal = async (product) => {
    try {
      const res = await instance.get(`/admin/products/${product.id}`);
      if (res.data.success) {
        setSelectedProduct(res.data.data);
        setImageFormData({
          imageUrl: "",
          images: res.data.data.images || [],
        });
        setShowImageModal(true);
      }
    } catch (error) {
      console.error("Error fetching product images:", error);
    }
  };

  const handleAddImage = async () => {
    if (!imageFormData.imageUrl.trim()) {
      toast.error("Vui lòng nhập URL ảnh");
      return;
    }
    try {
      const res = await instance.post(
        `/admin/products/${selectedProduct.id}/images`,
        {
          images: [imageFormData.imageUrl],
        }
      );
      if (res.data.success) {
        // Backend trả về toàn bộ danh sách ảnh, nên ta cập nhật lại images list
        setImageFormData({
          imageUrl: "",
          images: res.data.data || [],
        });
        fetchProducts();
      }
    } catch (error) {
      console.error("Error adding image:", error);
      toast.error("Lỗi khi thêm ảnh");
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!confirm("Bạn có chắc muốn xóa ảnh này?")) return;
    try {
      await instance.delete(
        `/admin/products/${selectedProduct.id}/images/${imageId}`
      );
      setImageFormData({
        ...imageFormData,
        images: imageFormData.images.filter((img) => img.id !== imageId),
      });
      fetchProducts();
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleSetMainImage = async (imageId) => {
    try {
      const res = await instance.put(
        `/admin/products/${selectedProduct.id}/images/${imageId}/set-main`
      );
      if (res.data.success) {
        setImageFormData({
          ...imageFormData,
          images: imageFormData.images.map((img) => ({
            ...img,
            is_main: img.id === imageId,
          })),
        });
        fetchProducts();
      }
    } catch (error) {
      console.error("Error setting main image:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await instance.put(`/admin/products/${editingId}`, formData);
      } else {
        const res = await instance.post("/admin/products", formData);
        // Thêm ảnh nếu có sau khi tạo sản phẩm
        if (res.data.success && imageFormData.images.length > 0) {
          const productId = res.data.data.id;
          const imageUrls = imageFormData.images.map((img) => img.imageUrl).filter((url) => url);
          if (imageUrls.length > 0) {
            await instance.post(`/admin/products/${productId}/images`, {
              images: imageUrls,
            });
          }
        }
      }
      setShowModal(false);
      setEditingId(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        category_id: "",
      });
      setImageFormData({
        imageUrl: "",
        images: [],
      });
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Lỗi khi lưu sản phẩm");
    }
  };

  const totalPages = Math.ceil(total / limit);

  if (loading && products.length === 0) {
    return <div className="text-center py-10">Đang tải...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản Lý Sản Phẩm</h1>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({
              name: "",
              description: "",
              price: "",
              stock: "",
              category_id: "",
            });
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={20} />
          Thêm Sản Phẩm
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
        />

        {/* Sắp xếp và lọc */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => {
              setSortBy("created_at");
              setPage(1);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              sortBy === "created_at"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Mới nhất
          </button>

          <button
            onClick={() => {
              setSortBy("name");
              setPage(1);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              sortBy === "name"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Tên sản phẩm
          </button>

          <button
            onClick={() => {
              setSortBy("price");
              setPage(1);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              sortBy === "price"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Giá
          </button>

          <button
            onClick={() => {
              setSortBy("stock");
              setPage(1);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              sortBy === "stock"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Tồn kho
          </button>

          <button
            onClick={() => {
              setSortBy("rating");
              setPage(1);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              sortBy === "rating"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Bán chạy nhất
          </button>

          <button
            onClick={() => {
              setShowStatusModal(true);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterStatus !== "ACTIVE"
                ? "bg-red-600 text-white"
                : "bg-green-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {filterStatus}
          </button>

          <button
            onClick={() => setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC")}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center gap-2 hover:bg-purple-700 font-medium ml-auto"
          >
            {sortOrder === "ASC" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            {sortOrder === "ASC" ? "Tăng dần" : "Giảm dần"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Ảnh</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Tên</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Giá</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Kho</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Đã Bán</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Trạng Thái</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-3">
                  {product.main_image ? (
                    <img
                      src={product.main_image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                      <ImageIcon size={20} className="text-gray-400" />
                    </div>
                  )}
                </td>
                <td className="px-6 py-3">{product.name}</td>
                <td className="px-6 py-3">${parseFloat(product.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td className="px-6 py-3">{product.stock}</td>
                <td className="px-6 py-3">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
                    {product.sold_quantity || 0} cái
                  </span>
                </td>
                <td className="px-6 py-3">
                  <select
                    value={product.status || "ACTIVE"}
                    onChange={(e) => handleChangeStatus(product.id, e.target.value)}
                    className={`px-2 py-1 rounded text-sm font-semibold cursor-pointer appearance-none ${
                      product.status === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    <option value="ACTIVE" className="bg-white text-black">Hoạt Động</option>
                    <option value="INACTIVE" className="bg-white text-black">Vô Hiệu</option>
                  </select>
                </td>
                <td className="px-6 py-3 flex gap-2 flex-wrap">
                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setStockData({ stock: product.stock });
                      setShowStockModal(true);
                    }}
                    className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600 whitespace-nowrap"
                  >
                    Cập Nhật Kho
                  </button>
                  <button
                    onClick={() => handleImageModal(product)}
                    className="bg-blue-500 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-blue-600 text-sm"
                  >
                    <ImageIcon size={16} />
                    Ảnh
                  </button>
                  <button
                    onClick={() => handleEdit(product)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-yellow-600 text-sm"
                  >
                    <Edit size={16} />
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-orange-600 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-orange-700 text-sm"
                  >
                    <Trash2 size={16} />
                    Ẩn
                  </button>
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-center gap-2">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i + 1}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded ${
              page === i + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0  bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? "Sửa Sản Phẩm" : "Thêm Sản Phẩm"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Tên sản phẩm"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded"
                required
              />
              <textarea
                placeholder="Mô tả"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
              <input
                type="number"
                placeholder="Giá"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded"
                required
              />
              <input
                type="number"
                placeholder="Kho"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded"
                required
              />
              <select
                value={formData.category_id}
                onChange={(e) =>
                  setFormData({ ...formData, category_id: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded"
                required
              >
                <option value="">-- Chọn Danh Mục --</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded"
              >
                <option value="ACTIVE">Hoạt Động</option>
                <option value="INACTIVE">Vô Hiệu</option>
              </select>

              {/* Phần thêm ảnh - chỉ hiển thị khi thêm sản phẩm mới */}
              {!editingId && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Thêm Ảnh (Tùy Chọn)</h3>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      placeholder="URL ảnh"
                      value={imageFormData.imageUrl}
                      onChange={(e) =>
                        setImageFormData({
                          ...imageFormData,
                          imageUrl: e.target.value,
                        })
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (imageFormData.imageUrl.trim()) {
                          setImageFormData({
                            ...imageFormData,
                            images: [
                              ...imageFormData.images,
                              { imageUrl: imageFormData.imageUrl },
                            ],
                            imageUrl: "",
                          });
                        }
                      }}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Thêm
                    </button>
                  </div>
                  {imageFormData.images.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        Danh sách ảnh: ({imageFormData.images.length})
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {imageFormData.images.map((img, index) => (
                          <div
                            key={index}
                            className="relative border border-gray-200 rounded overflow-hidden"
                          >
                            <img
                              src={img.imageUrl}
                              alt="preview"
                              className="w-full h-20 object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setImageFormData({
                                  ...imageFormData,
                                  images: imageFormData.images.filter(
                                    (_, i) => i !== index
                                  ),
                                });
                              }}
                              className="absolute top-0 right-0 bg-red-600 text-white px-2 py-1 text-xs hover:bg-red-700"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Lưu
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showImageModal && selectedProduct && (
        <div className="fixed inset-0  bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-96 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              Quản Lý Ảnh - {selectedProduct.name}
            </h2>

            {/* Thêm ảnh mới */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-3">Thêm Ảnh Mới</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nhập URL ảnh"
                  value={imageFormData.imageUrl}
                  onChange={(e) =>
                    setImageFormData({
                      ...imageFormData,
                      imageUrl: e.target.value,
                    })
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded"
                />
                <button
                  onClick={handleAddImage}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Thêm
                </button>
              </div>
            </div>

            {/* Danh sách ảnh */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Danh Sách Ảnh</h3>
              {imageFormData.images.length === 0 ? (
                <p className="text-gray-500">Chưa có ảnh nào</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {imageFormData.images.map((image) => (
                    <div
                      key={image.id}
                      className="relative group border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <img
                        src={image.image_url}
                        alt="product"
                        className="w-full h-32 object-cover"
                      />
                      {image.is_main && (
                        <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                          <Star size={12} />
                          Default
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0  bg-black/50 text-white opacity-0 group-hover:opacity-100 transition p-2 flex gap-2">
                        {!image.is_main && (
                          <button
                            onClick={() => handleSetMainImage(image.id)}
                            className="flex-1 bg-yellow-500 hover:bg-yellow-600 px-2 py-1 rounded text-xs"
                          >
                            Làm Default
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteImage(image.id)}
                          className="flex-1 bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Nút đóng */}
            <div className="flex justify-end">
              <button
                onClick={() => setShowImageModal(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STOCK UPDATE MODAL */}
      {showStockModal && selectedProduct && (
        <div className="fixed inset-0  bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Cập Nhật Kho - {selectedProduct.name}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Số Lượng Tồn Kho Hiện Tại: {selectedProduct.stock}</label>
                <input
                  type="number"
                  placeholder="Nhập số lượng mới"
                  value={stockData.stock}
                  onChange={(e) => setStockData({ stock: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  min="0"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleUpdateStock}
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Cập Nhật
                </button>
                <button
                  onClick={() => setShowStockModal(false)}
                  className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STATUS FILTER MODAL */}
      {showStatusModal && (
        <div className="fixed inset-0  bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Lọc Theo Trạng Thái</h2>
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="status_active"
                    name="status_filter"
                    value="ACTIVE"
                    checked={filterStatus === "ACTIVE"}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="mr-3"
                  />
                  <label htmlFor="status_active" className="flex items-center cursor-pointer flex-1">
                    <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                    <span className="font-medium">Hoạt Động</span>
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="status_inactive"
                    name="status_filter"
                    value="INACTIVE"
                    checked={filterStatus === "INACTIVE"}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="mr-3"
                  />
                  <label htmlFor="status_inactive" className="flex items-center cursor-pointer flex-1">
                    <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                    <span className="font-medium">Vô Hiệu</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-medium"
                >
                  Áp Dụng
                </button>
                <button
                  onClick={() => {
                    setFilterStatus("ACTIVE");
                    setShowStatusModal(false);
                  }}
                  className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400 font-medium"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
