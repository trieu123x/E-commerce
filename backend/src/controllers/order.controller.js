import orderService from "../services/order.service.js";

export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { address_id } = req.body;
    const order = await orderService.createOrder(userId, address_id);
    res.status(201).json({
      success: true,
      message: "Tạo đơn hàng thành công",
      data: order,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(error.message === "Địa chỉ giao hàng không hợp lệ" || error.message === "Giỏ hàng trống" ? 400 : 500).json({
      success: false,
      message: error.message || "Lỗi server khi tạo đơn hàng",
    });
  }
};

export const buyNow = async (req, res) => {
  try {
    const userId = req.user.id;
    const order = await orderService.buyNow(userId, req.body);
    res.status(201).json({
      success: true,
      message: "Đặt hàng thành công",
      data: order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOrdersByUserId = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await orderService.getOrdersByUserId(userId, req.query);
    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy đơn hàng",
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const order = await orderService.getOrderById(userId, id);
    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    if (error.message === "Đơn hàng không tồn tại") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy đơn hàng",
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const result = await orderService.getAllOrders(req.query);
    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy đơn hàng",
    });
  }
};

export const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const orderData = await orderService.getOrderDetails(id);
    res.json({
      success: true,
      data: orderData,
    });
  } catch (error) {
    console.error("Error fetching order details:", error);
    if (error.message === "Đơn hàng không tồn tại") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy chi tiết đơn hàng",
    });
  }
};
