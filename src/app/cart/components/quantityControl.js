import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import instance from "../../api/axios"; 

export default function QuantityControl({ item, setCart }) {
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (newQty) => {
    if (newQty < 1 || newQty > item.stock) return;

    try {
      setLoading(true);

      const res = await instance.put(
        `/cart/items/${item.id}`,
        { quantity: newQty }
      );

      if (res.data.success) {
        setCart((prev) => ({
          ...prev,
          items: prev.items.map((i) =>
            i.id === item.id ? res.data.cartItem : i
          ),
        }));
      }
    } catch (err) {
      console.error("Update qty error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center  rounded-md overflow-hidden w-fit">

      {/* Minus */}
      <button
        onClick={() => handleUpdate(item.quantity - 1)}
        disabled={loading || item.quantity <= 1}
        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
      >
        <Minus size={16} />
      </button>

      {/* Quantity */}
      <div className="px-4 py-2 min-w-10 text-center">
        {item.quantity}
      </div>

      {/* Plus */}
      <button
        onClick={() => handleUpdate(item.quantity + 1)}
        disabled={loading || item.quantity >= item.stock}
        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}