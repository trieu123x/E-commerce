import { jest } from '@jest/globals';

const mockSale = { create: jest.fn(), findAll: jest.fn(), findByPk: jest.fn(), update: jest.fn(), destroy: jest.fn() };
const mockProductSale = { bulkCreate: jest.fn(), destroy: jest.fn() };
const mockDb = { Sale: mockSale, ProductSale: mockProductSale, Product: {}, ProductImage: {}, Sequelize: { Op: { lte: Symbol('lte'), gte: Symbol('gte') } } };

jest.unstable_mockModule('../../models/index.js', () => ({ default: mockDb }));

let saleController;
beforeAll(async () => {
  saleController = await import('../../src/controllers/sale.controller.js');
});

describe('Sale Controller Unit Tests', () => {
  let req, res;
  beforeEach(() => {
    req = { body: {}, params: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    jest.clearAllMocks();
  });

  describe('createSale', () => {
    it('should return 400 if start date >= end date', async () => {
      req.body = { start_date: '2025-02-01', end_date: '2025-01-01' };
      await saleController.createSale(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'End date must be after start date' }));
    });

    it('should create sale', async () => {
      req.body = { start_date: '2025-01-01', end_date: '2025-02-01' };
      mockSale.create.mockResolvedValueOnce({ id: 1 });
      await saleController.createSale(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });
  });

  describe('addProductToSale', () => {
    it('should return 404 if sale not found', async () => {
      req.params = { saleId: 1 };
      mockSale.findByPk.mockResolvedValueOnce(null);
      await saleController.addProductToSale(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should add products to sale', async () => {
      req.params = { saleId: 1 };
      req.body = { productIds: [1, 2] };
      mockSale.findByPk.mockResolvedValueOnce({ id: 1 });
      mockProductSale.bulkCreate.mockResolvedValueOnce([]);
      await saleController.addProductToSale(req, res);
      expect(mockProductSale.bulkCreate).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });
  });
});
