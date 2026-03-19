import instance from "../api/axios";

// Cache để lưu dữ liệu orders
let ordersCache = null;
let lastFetch = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 phút

/**
 * Lấy dữ liệu orders và tính số lượng bán cho mỗi sản phẩm
 * Sử dụng cache để tránh gọi API nhiều lần
 */
export const fetchOrdersAndCalculateSales = async (forceRefresh = false) => {
  const now = Date.now();
  
  // Nếu có cache và chưa hết hạn, trả về cache
  if (ordersCache && !forceRefresh && (now - lastFetch) < CACHE_DURATION) {
    return ordersCache;
  }

  try {
    const res = await instance.get("/admin/orders", {
      params: {
        limit: 1000
      }
    });

    if (res.data.success) {
      const productSalesMap = {};

      // Tính toán số lượng bán cho mỗi sản phẩm
      res.data.data.forEach(order => {
        if (order.items && Array.isArray(order.items)) {
          order.items.forEach(item => {
            const productId = item.product_id;
            if (!productSalesMap[productId]) {
              productSalesMap[productId] = {
                product_id: productId,
                product_name: item.product?.name || `Product #${productId}`,
                sold_quantity: 0,
                revenue: 0
              };
            }
            productSalesMap[productId].sold_quantity += item.quantity;
            productSalesMap[productId].revenue += parseFloat(item.total || 0);
          });
        }
      });

      ordersCache = productSalesMap;
      lastFetch = now;
      
      return productSalesMap;
    }
  } catch (error) {
    console.error("Error fetching orders data:", error);
    return ordersCache || {};
  }
};

/**
 * Lấy số lượng bán của một sản phẩm cụ thể
 */
export const getProductSoldQuantity = async (productId) => {
  const salesMap = await fetchOrdersAndCalculateSales();
  return salesMap[productId]?.sold_quantity || 0;
};

/**
 * Lấy tất cả dữ liệu bán hàng
 */
export const getAllProductsSalesData = async () => {
  return await fetchOrdersAndCalculateSales();
};
