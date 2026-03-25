import { jest } from '@jest/globals';
import request from 'supertest';

const mockProduct = { findAndCountAll: jest.fn(), findByPk: jest.fn(), findAll: jest.fn(), count: jest.fn() };
const mockReview = { create: jest.fn(), findOne: jest.fn() };
const mockOrderItem = { findOne: jest.fn() };

const mockDb = { 
  Sequelize: { Op: { lte: Symbol(), gte: Symbol(), ne: Symbol() }, literal: jest.fn() },
  sequelize: { transaction: jest.fn() },
  Product: mockProduct, Review: mockReview, OrderItem: mockOrderItem,
  Category: {}, ProductImage: {}, Sale: {}, User: {}, Order: {}, Address: {}, Cart: {}, CartItem: {}, Payment: {}, ProductSale: {}, Wishlist: {}
};

jest.unstable_mockModule('../../models/index.js', () => ({ default: mockDb }));

const mockJwt = { verify: jest.fn() };
jest.unstable_mockModule('jsonwebtoken', () => ({ default: mockJwt }));

let app;
beforeAll(async () => {
  const appModule = await import('../../src/app.js');
  app = appModule.default;
});

describe('Products Routes Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/products', () => {
    it('should return products pagination', async () => {
      mockProduct.findAll.mockResolvedValueOnce([{ 
        id: 1, price: 100, 
        toJSON: () => ({ id: 1, price: 100 }),
        get: () => ({ id: 1, price: 100 })
      }]);
      mockProduct.count.mockResolvedValueOnce(1);
      const res = await request(app).get('/api/products');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('data');
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return 404 if product not found', async () => {
      mockProduct.findByPk.mockResolvedValueOnce(null);
      const res = await request(app).get('/api/products/999');
      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/products/:product_id/reviews', () => {
    it('should block unauthenticated users', async () => {
      mockJwt.verify.mockImplementationOnce(() => { 
        const err = new Error('invalid token'); 
        err.name = 'JsonWebTokenError';
        throw err; 
      });
      const res = await request(app).post('/api/products/1/reviews').set('Authorization', 'Bearer badtoken').send({ rating: 5, content: 'good' });
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Token không hợp lệ');
    });

    it('should return 403 if user hasn\'t purchased product', async () => {
      mockJwt.verify.mockReturnValueOnce({ id: 1 });
      mockOrderItem.findOne.mockResolvedValueOnce(null); // Not purchased
      const res = await request(app).post('/api/products/1/reviews').set('Authorization', 'Bearer validtoken').send({ rating: 5, content: 'good' });
      expect(res.status).toBe(403);
    });
  });
});
