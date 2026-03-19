"use client";
import { useEffect, useState } from "react";
import instance from "../../api/axios";
import { Trash2, Edit, Plus, ChevronDown, ChevronRight } from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    parent_id: null,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await instance.get("/admin/categories");
      if (res.data.success) {
        const cats = res.data.categories;
        setAllCategories(cats);
        // Chỉ hiển thị danh mục cha (parent_id = null)
        setCategories(cats.filter(cat => !cat.parent_id));
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };
console.log(categories)
  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa danh mục này?")) return;
    try {
      await instance.delete(`/admin/categories/${id}`);
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleEdit = (category) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      description: category.description || "",
      parent_id: category.parent_id || null,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await instance.put(`/admin/categories/${editingId}`, formData);
      } else {
        await instance.post("/admin/categories", formData);
      }
      setShowModal(false);
      setEditingId(null);
      setFormData({ name: "", description: "" });
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Đang tải...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản Lý Danh Mục</h1>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({ name: "", description: "", parent_id: null });
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={20} />
          Thêm Danh Mục
        </button>
      </div>

      <div className="space-y-2">
        {categories.map((category) => {
          const isExpanded = expandedCategories.has(category.id);
          const childCategories = allCategories.filter(cat => cat.parent_id === category.id);
          
          return (
            <div key={category.id}>
              {/* Danh mục cha */}
              <div className="bg-white rounded-lg shadow hover:shadow-lg transition">
                <div className="p-4 flex items-center gap-3">
                  {childCategories.length > 0 ? (
                    <button
                      onClick={() => {
                        const newExpanded = new Set(expandedCategories);
                        if (newExpanded.has(category.id)) {
                          newExpanded.delete(category.id);
                        } else {
                          newExpanded.add(category.id);
                        }
                        setExpandedCategories(newExpanded);
                      }}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      {isExpanded ? (
                        <ChevronDown size={20} />
                      ) : (
                        <ChevronRight size={20} />
                      )}
                    </button>
                  ) : (
                    <div className="w-8"></div>
                  )}
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{category.name}</h3>
                    <p className="text-gray-600 text-sm">
                      {category.description || "Không có mô tả"}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-yellow-600"
                    >
                      <Edit size={16} />
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-red-700"
                    >
                      <Trash2 size={16} />
                      Xóa
                    </button>
                  </div>
                </div>

                {/* Danh mục con */}
                {isExpanded && childCategories.length > 0 && (
                  <div className="border-t bg-gray-50 space-y-2 p-4">
                    {childCategories.map((child) => (
                      <div
                        key={child.id}
                        className="bg-white rounded p-3 border-l-4 border-blue-400 flex items-center gap-3"
                      >
                        <div className="w-5"></div>
                        <div className="flex-1">
                          <p className="font-medium">{child.name}</p>
                          <p className="text-gray-600 text-sm">
                            {child.description || "Không có mô tả"}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(child)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-yellow-600 text-sm"
                          >
                            <Edit size={14} />
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(child.id)}
                            className="bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-red-700 text-sm"
                          >
                            <Trash2 size={14} />
                            Xóa
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-h-96 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? "Sửa Danh Mục" : "Thêm Danh Mục"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Tên danh mục"
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
              <div>
                <label className="block text-sm font-medium mb-2">Danh Mục Cha (Tuỳ chọn)</label>
                <select
                  value={formData.parent_id || ""}
                  onChange={(e) =>
                    setFormData({ 
                      ...formData, 
                      parent_id: e.target.value ? parseInt(e.target.value) : null 
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                >
                  <option value="">-- Không có danh mục cha --</option>
                  {categories
                    .filter(cat => cat.id !== editingId)
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                </select>
              </div>
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
    </div>
  );
}
