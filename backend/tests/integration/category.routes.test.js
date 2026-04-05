import "dotenv/config";
import { jest } from '@jest/globals';
import request from 'supertest';

const mockCategory = { findAll: jest.fn(), findByPk: jest.fn() };
const mockDb = {
  Sequelize: { Op: { lte: Symbol(), gte: Symbol(), ne: Symbol() }, literal: jest.fn() },
  sequelize: { transaction: jest.fn() },
  Category: mockCategory,
  Product: {}, Review: {}, OrderItem: {},
  Address: {}, Cart: {}, CartItem: {}, Order: {}, Payment: {}, ProductImage: {}, ProductSale: {}, Sale: {}, User: {}, Wishlist: {}
};

jest.unstable_mockModule('../../models/index.js', () => ({ default: mockDb }));

let app;
beforeAll(async () => {
  const appModule = await import('../../src/app.js');
  app = appModule.default;
});

describe('Category Routes Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/categories', () => {
    it('should return 200 and all categories', async () => {
      mockCategory.findAll.mockResolvedValueOnce([{ id: 1, name: 'Electronics' }]);
      const res = await request(app).get('/api/categories');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.categories).toHaveLength(1);
    });
  });

  describe('GET /api/categories/parents', () => {
    it('should return 200 and parent categories', async () => {
      mockCategory.findAll.mockResolvedValueOnce([{ id: 1, parent_id: null }]);
      const res = await request(app).get('/api/categories/parents');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.categories)).toBe(true);
    });
  });

  describe('GET /api/categories/:id', () => {
    it('should return 404 if not found', async () => {
      mockCategory.findByPk.mockResolvedValueOnce(null);
      const res = await request(app).get('/api/categories/999');
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message');
    });

    it('should return 200 if found', async () => {
      mockCategory.findByPk.mockResolvedValueOnce({ id: 1, name: 'Laptop' });
      const res = await request(app).get('/api/categories/1');
      expect(res.status).toBe(200);
      expect(res.body.category.name).toBe('Laptop');
    });
  });
});
