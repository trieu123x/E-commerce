import { jest } from '@jest/globals';

const mockProductService = {
  getAllProducts: jest.fn(),
  getProductById: jest.fn(),
};

jest.unstable_mockModule('../../src/services/product.service.js', () => ({
  default: mockProductService,
}));

let productsController;

describe('Products Controller Unit Tests', () => {
  let req, res;

  beforeAll(async () => {
    productsController = await import('../../src/controllers/products.controller.js');
  });

  beforeEach(() => {
    req = { query: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('getAllProducts', () => {
    it('should fetch products and return 200', async () => {
      const mockResult = {
        data: [{ id: 1, name: 'Product 1' }],
        pagination: { page: 1, limit: 21, total: 1 }
      };
      mockProductService.getAllProducts.mockResolvedValueOnce(mockResult);

      await productsController.getAllProducts(req, res);

      expect(mockProductService.getAllProducts).toHaveBeenCalledWith(req.query);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        ...mockResult
      });
    });

    it('should handle internal errors', async () => {
      mockProductService.getAllProducts.mockRejectedValueOnce(new Error('DB Failed'));

      await productsController.getAllProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Lỗi server',
        error: 'DB Failed'
      });
    });
  });

  describe('getProductById', () => {
    it('should return 404 if product not found', async () => {
      req.params = { id: 999 };
      mockProductService.getProductById.mockRejectedValueOnce(new Error('Sản phẩm không tồn tại'));

      await productsController.getProductById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Sản phẩm không tồn tại'
      });
    });

    it('should return 200 if found', async () => {
      req.params = { id: 1 };
      const mockProduct = { id: 1, name: 'Product 1' };
      mockProductService.getProductById.mockResolvedValueOnce(mockProduct);

      await productsController.getProductById(req, res);

      expect(mockProductService.getProductById).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        product: mockProduct
      });
    });
  });
});
