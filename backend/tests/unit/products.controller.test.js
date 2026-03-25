import { jest } from '@jest/globals';

const mockProduct = {
  findAll: jest.fn(),
  count: jest.fn(),
  findByPk: jest.fn(),
};

const mockDb = {
  Product: mockProduct,
  ProductImage: {},
  Wishlist: {},
  Review: {},
  Sale: {},
  ProductSale: {}
};

jest.unstable_mockModule('../../models/index.js', () => ({
  default: mockDb,
}));

jest.unstable_mockModule('sequelize', () => ({
  Op: {
    ne: Symbol('ne'),
    iLike: Symbol('iLike'),
    gte: Symbol('gte'),
    lte: Symbol('lte'),
  },
  literal: jest.fn((str) => str),
  fn: jest.fn(),
  col: jest.fn()
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
    it('should fetch products with default pagination and return 200', async () => {
      const mockRows = [{
        id: 1, 
        price: 100,
        name: 'Product 1',
        createdAt: '2025-01-01',
        sales: [],
        images: [{ image_url: 'url' }],
        get: jest.fn().mockImplementation((key) => {
           if(key === 'likes') return 5;
           if(key === 'avg_rating') return 4.5;
           if(key === 'review_count') return 10;
        })
      }];
      mockProduct.findAll.mockResolvedValueOnce(mockRows);
      mockProduct.count.mockResolvedValueOnce(1); // total

      await productsController.getAllProducts(req, res);

      expect(mockProduct.findAll).toHaveBeenCalled();
      expect(mockProduct.count).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.any(Array),
        pagination: expect.objectContaining({
          page: 1,
          limit: 21,
          total: 1
        })
      }));
    });

    it('should handle internal errors', async () => {
      mockProduct.findAll.mockRejectedValueOnce(new Error('DB Failed'));

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
      mockProduct.findByPk.mockResolvedValueOnce(null);

      await productsController.getProductById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Sản phẩm không tồn tại'
      });
    });

    it('should return 200 with formatted product if found', async () => {
      req.params = { id: 1 };
      const productData = {
        id: 1,
        price: 100,
        name: 'Product 1',
        sales: [],
        images: [],
        get: jest.fn().mockImplementation((key) => {
          if(key === 'rating') return '4.0';
          if(key === 'review_count') return 5;
        }),
        toJSON: () => ({ id: 1, price: 100, name: 'Product 1' })
      };
      mockProduct.findByPk.mockResolvedValueOnce(productData);

      await productsController.getProductById(req, res);

      expect(mockProduct.findByPk).toHaveBeenCalledWith(1, expect.any(Object));
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        product: expect.objectContaining({
          id: 1,
          price: 100,
          name: 'Product 1',
          rating: '4.0',
          review_count: 5
        })
      });
    });
  });
});
