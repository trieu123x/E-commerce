import { jest } from '@jest/globals';

const mockSaleService = {
  createSale: jest.fn(),
  getAllSales: jest.fn(),
  getSaleById: jest.fn(),
  updateSale: jest.fn(),
  deleteSale: jest.fn(),
  addProductToSale: jest.fn(),
  removeProductFromSale: jest.fn(),
};

jest.unstable_mockModule('../../src/services/sale.service.js', () => ({
  default: mockSaleService,
}));

let saleController;
beforeAll(async () => {
  saleController = await import('../../src/controllers/sale.controller.js');
});

describe('Sale Controller Unit Tests', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {}, query: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    jest.clearAllMocks();
  });

  describe('createSale', () => {
    it('should create sale and return 200', async () => {
      req.body = { name: 'Holiday Sale', discount_value: 10 };
      const mockSale = { id: 1, ...req.body };
      mockSaleService.createSale.mockResolvedValueOnce(mockSale);

      await saleController.createSale(req, res);

      expect(mockSaleService.createSale).toHaveBeenCalledWith(req.body);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: mockSale });
    });

    it('should handle validation errors (400)', async () => {
      req.body = { start_date: '2025-02-01', end_date: '2025-01-01' };
      mockSaleService.createSale.mockRejectedValueOnce(new Error('End date must be after start date'));

      await saleController.createSale(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'End date must be after start date' }));
    });
  });

  describe('addProductToSale', () => {
    it('should add products to sale', async () => {
      req.params = { saleId: 1 };
      req.body = { productIds: [1, 2] };
      mockSaleService.addProductToSale.mockResolvedValueOnce();

      await saleController.addProductToSale(req, res);

      expect(mockSaleService.addProductToSale).toHaveBeenCalledWith(1, [1, 2]);
      expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Products added to sale' });
    });
  });
});
