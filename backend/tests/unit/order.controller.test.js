import { jest } from '@jest/globals';

const mockOrderService = {
  createOrder: jest.fn(),
  getOrdersByUserId: jest.fn(),
  getOrderById: jest.fn(),
  updateOrderStatus: jest.fn(),
  cancelOrder: jest.fn(),
  buyNow: jest.fn(),
  getAllOrders: jest.fn(),
  getOrderDetails: jest.fn(),
};

jest.unstable_mockModule('../../src/services/order.service.js', () => ({
  default: mockOrderService,
}));

let orderController;
beforeAll(async () => {
  orderController = await import('../../src/controllers/order.controller.js');
});

describe('Order Controller Unit Tests', () => {
  let req, res;

  beforeEach(() => {
    req = { user: { id: 1 }, body: {}, params: {}, query: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    it('should create an order and return 201', async () => {
      req.body = { address_id: 1 };
      const mockOrder = { id: 1, total_amount: 100 };
      mockOrderService.createOrder.mockResolvedValueOnce(mockOrder);

      await orderController.createOrder(req, res);

      expect(mockOrderService.createOrder).toHaveBeenCalledWith(1, 1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Tạo đơn hàng thành công',
        data: mockOrder
      });
    });

    it('should handle errors like invalid address (400)', async () => {
      req.body = { address_id: 99 };
      mockOrderService.createOrder.mockRejectedValueOnce(new Error('Địa chỉ giao hàng không hợp lệ'));

      await orderController.createOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Địa chỉ giao hàng không hợp lệ'
      });
    });
  });

  describe('getOrdersByUserId', () => {
    it('should fetch orders', async () => {
      const mockResult = { data: [], pagination: {} };
      mockOrderService.getOrdersByUserId.mockResolvedValueOnce(mockResult);

      await orderController.getOrdersByUserId(req, res);

      expect(mockOrderService.getOrdersByUserId).toHaveBeenCalledWith(1, req.query);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        ...mockResult
      });
    });
  });
});
