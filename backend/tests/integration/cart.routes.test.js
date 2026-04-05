import { jest } from '@jest/globals';
import request from 'supertest';

const mockCartItem = { create: jest.fn(), update: jest.fn(), destroy: jest.fn(), sum: jest.fn(), findOrCreate: jest.fn(), findOne: jest.fn() };
const mockCart = { findOne: jest.fn(), sum: jest.fn(), findOrCreate: jest.fn() };
const mockOrder = { create: jest.fn(), findAll: jest.fn(), findOne: jest.fn(), count: jest.fn(), update: jest.fn(), findByPk: jest.fn() };
const mockOrderItem = { create: jest.fn(), bulkCreate: jest.fn() };
const mockPayment = { create: jest.fn() };
const mockProduct = { findByPk: jest.fn(), findOne: jest.fn() };
const mockAddress = { findOne: jest.fn() };

const mockDb = { 
  Sequelize: { Op: { lte: Symbol(), gte: Symbol(), ne: Symbol() }, literal: jest.fn() },
  sequelize: { transaction: jest.fn().mockResolvedValue({ commit: jest.fn(), rollback: jest.fn(), LOCK: { UPDATE: Symbol() } }) },
  Cart: mockCart, CartItem: mockCartItem,
  Category: { findAll: jest.fn() }, ProductImage: { findAll: jest.fn() }, Sale: { findAll: jest.fn() }, User: { findOne: jest.fn() }, Order: mockOrder, OrderItem: mockOrderItem, Address: mockAddress, Payment: mockPayment, ProductSale: {}, Wishlist: {}, Product: mockProduct, Review: { findAll: jest.fn() }
};
jest.unstable_mockModule('../../models/index.js', () => ({ default: mockDb }));

const mockJwt = { verify: jest.fn() };
jest.unstable_mockModule('jsonwebtoken', () => ({ default: mockJwt }));

let app;
beforeAll(async () => {
  const appModule = await import('../../src/app.js');
  app = appModule.default;
});

describe('Cart Routes Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Authentication', () => {
    it('should return 401 if token is missing or invalid', async () => {
      mockJwt.verify.mockImplementationOnce(() => { 
        const err = new Error('invalid token'); err.name = 'JsonWebTokenError'; throw err; 
      });
      const res = await request(app).get('/api/cart').set('Authorization', 'Bearer bad');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/cart', () => {
    it('should return user cart', async () => {
      mockJwt.verify.mockReturnValue({ id: 1 });
      mockCart.findOrCreate.mockResolvedValueOnce([{ id: 1, items: [] }]);
      const res = await request(app).get('/api/cart').set('Authorization', 'Bearer valid');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('POST /api/cart/add', () => {
    it('should add item to cart', async () => {
      mockJwt.verify.mockReturnValue({ id: 1 });
      mockCart.findOrCreate.mockResolvedValueOnce([{ id: 1 }]); 
      mockProduct.findByPk.mockResolvedValueOnce({ 
        id: 2, stock: 10, status: 'ACTIVE', price: 100, 
        sales: [],
        get: jest.fn().mockReturnValue([]) // for any associations
      });
      mockCartItem.findOne.mockResolvedValueOnce(null); // 1. findCartItem (line 48) - not in cart yet
      mockCartItem.create.mockResolvedValueOnce({ id: 10 });
      mockCartItem.findOne.mockResolvedValueOnce({ id: 10 }); // 2. findCartItem (line 59) - to get ID after create
      mockCartItem.findOne.mockResolvedValueOnce({ // 3. findCartItemWithProduct (line 58)
        id: 10, cart_id: 1, product_id: 2, quantity: 1,
        product: { id: 2, name: 'Test Product', price: 100, stock: 10, sales: [] }
      });
      
      const res = await request(app).post('/api/cart/add').set('Authorization', 'Bearer valid').send({ product_id: 2, quantity: 1 });
      expect(res.status).toBe(201); 
      expect(res.body.success).toBe(true);
    });
  });
});
