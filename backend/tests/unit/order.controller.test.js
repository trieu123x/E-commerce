import { jest } from '@jest/globals';

const mockTransaction = { commit: jest.fn(), rollback: jest.fn(), LOCK: { UPDATE: 'UPDATE' } };
const mockOrder = { create: jest.fn(), findAll: jest.fn(), count: jest.fn(), findOne: jest.fn() };
const mockOrderItem = { create: jest.fn(), bulkCreate: jest.fn() };
const mockAddress = { findOne: jest.fn(), findByPk: jest.fn() };
const mockCart = { findOne: jest.fn() };
const mockCartItem = { destroy: jest.fn() };

const mockDb = {
  Order: mockOrder, OrderItem: mockOrderItem, Address: mockAddress,
  Cart: mockCart, CartItem: mockCartItem, Product: {}, ProductImage: {}, User: {}, Sale: {},
  sequelize: { transaction: jest.fn(() => mockTransaction) }
};

jest.unstable_mockModule('../../models/index.js', () => ({ default: mockDb }));

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
    it('should rollback and return 400 if address invalid', async () => {
      req.body = { address_id: 1 };
      mockAddress.findOne.mockResolvedValueOnce(null);
      await orderController.createOrder(req, res);
      expect(mockTransaction.rollback).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should rollback and return 400 if cart empty', async () => {
      req.body = { address_id: 1 };
      mockAddress.findOne.mockResolvedValueOnce({ id: 1 });
      mockCart.findOne.mockResolvedValueOnce({ items: [] });
      await orderController.createOrder(req, res);
      expect(mockTransaction.rollback).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('getOrdersByUserId', () => {
    it('should fetch paginated orders', async () => {
      req.query = { page: 1, limit: 10 };
      mockOrder.findAll.mockResolvedValueOnce([{ id: 1 }]);
      mockOrder.count.mockResolvedValueOnce(1);
      
      await orderController.getOrdersByUserId(req, res);
      
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: [{ id: 1 }],
        pagination: expect.any(Object)
      }));
    });
  });
});
