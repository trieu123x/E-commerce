import "dotenv/config";
import { jest } from '@jest/globals';
import request from 'supertest';

const mockCartItem = { create: jest.fn(), update: jest.fn(), destroy: jest.fn(), sum: jest.fn(), findOrCreate: jest.fn() };
const mockCart = { findOne: jest.fn(), sum: jest.fn(), findOrCreate: jest.fn() };
const mockOrder = { create: jest.fn(), findAll: jest.fn(), findOne: jest.fn(), count: jest.fn(), update: jest.fn(), findByPk: jest.fn() };
const mockOrderItem = { create: jest.fn(), bulkCreate: jest.fn() };
const mockPayment = { create: jest.fn() };
const mockProduct = { findByPk: jest.fn() };
const mockAddress = { findOne: jest.fn() };

const mockDb = { 
  Sequelize: { Op: { lte: Symbol(), gte: Symbol(), ne: Symbol() }, literal: jest.fn() },
  sequelize: { transaction: jest.fn().mockResolvedValue({ commit: jest.fn(), rollback: jest.fn(), LOCK: { UPDATE: Symbol() } }) },
  Cart: mockCart, CartItem: mockCartItem,
  Category: {}, ProductImage: {}, Sale: {}, User: { findByPk: jest.fn() }, Order: mockOrder, OrderItem: mockOrderItem, Address: mockAddress, Payment: mockPayment, ProductSale: {}, Wishlist: {}, Product: mockProduct, Review: {}
};

jest.unstable_mockModule('../../models/index.js', () => ({ default: mockDb }));

const mockJwt = { verify: jest.fn() };
jest.unstable_mockModule('jsonwebtoken', () => ({ default: mockJwt }));

let app;
beforeAll(async () => {
  const appModule = await import('../../src/app.js');
  app = appModule.default;
});

describe('Order Routes Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockJwt.verify.mockReturnValue({ id: 1 });
  });

  describe('GET /api/orders/your-order', () => {
    it('should get all orders for user', async () => {
      mockOrder.findAll.mockResolvedValueOnce([{ id: 1 }]);
      const res = await request(app).get('/api/order/your-order').set('Authorization', 'Bearer valid');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual([{ id: 1 }]);
    });
  });

  describe('POST /api/orders/', () => {
    it('should create an order successfully', async () => {
      mockDb.Address.findOne.mockResolvedValueOnce({ id: 1 });
      mockDb.Product.findByPk.mockResolvedValueOnce({ id: 1, stock: 10, name: 'Product', price: 100, getSales: jest.fn().mockResolvedValue([]), save: jest.fn() });
      mockOrder.create.mockResolvedValueOnce({ id: 101, total_amount: 100 });
      mockOrderItem.bulkCreate.mockResolvedValueOnce([]);

      const res = await request(app).post('/api/order/').set('Authorization', 'Bearer valid').send({
        address_id: 1, payment_method: 'COD', product_id: 1
      });
      // the controller might return status 201 or 200
      expect([200, 201]).toContain(res.status);
      expect(res.body.success).toBe(true);
    });
  });
});
