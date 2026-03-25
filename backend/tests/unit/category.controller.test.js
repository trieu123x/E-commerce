import { jest } from '@jest/globals';

const mockCategory = {
  create: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
  count: jest.fn(),
  destroy: jest.fn(),
};

const mockProduct = {
  count: jest.fn(),
  update: jest.fn(),
};

const mockTransaction = {
  commit: jest.fn(),
  rollback: jest.fn(),
};

const mockDb = {
  Category: mockCategory,
  Product: mockProduct,
  sequelize: {
    transaction: jest.fn(() => mockTransaction),
  },
};

jest.unstable_mockModule('../../models/index.js', () => ({
  default: mockDb,
}));

// Load controller after mocking
let categoryController;

describe('Category Controller Unit Tests', () => {
  let req, res;

  beforeAll(async () => {
    categoryController = await import('../../src/controllers/category.controller.js');
  });

  beforeEach(() => {
    req = { body: {}, params: {}, query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('createCategory', () => {
    it('should create a category and return 201', async () => {
      req.body = { name: 'Electronics', parent_id: null };
      mockCategory.create.mockResolvedValueOnce({ id: 1, name: 'Electronics', parent_id: null });

      await categoryController.createCategory(req, res);

      expect(mockCategory.create).toHaveBeenCalledWith({ name: 'Electronics', parent_id: null });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Category created successfully',
        category: { id: 1, name: 'Electronics', parent_id: null }
      });
    });

    it('should handle internal errors and return 500', async () => {
      req.body = { name: 'Electronics' };
      mockCategory.create.mockRejectedValueOnce(new Error('DB Error'));

      await categoryController.createCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Internal server error'
      });
    });
  });

  describe('getAllCategories', () => {
    it('should fetch all categories', async () => {
      mockCategory.findAll.mockResolvedValueOnce([{ id: 1, name: 'Cat1' }]);

      await categoryController.getAllCategories(req, res);

      expect(mockCategory.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        categories: [{ id: 1, name: 'Cat1' }]
      });
    });
  });

  describe('getCategoryById', () => {
    it('should return 404 if not found', async () => {
      req.params = { id: 99 };
      mockCategory.findByPk.mockResolvedValueOnce(null);

      await categoryController.getCategoryById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Category not found'
      });
    });
  });

  describe('deleteCategory', () => {
    it('should return 404 if category not found', async () => {
      req.params = { id: 1 };
      mockCategory.findByPk.mockResolvedValueOnce(null);

      await categoryController.deleteCategory(req, res);

      expect(mockTransaction.rollback).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should not delete category if it has children and return 400', async () => {
      req.params = { id: 1 };
      mockCategory.findByPk.mockResolvedValueOnce({ id: 1, destroy: jest.fn() });
      mockCategory.count.mockResolvedValueOnce(2); // Has 2 children

      await categoryController.deleteCategory(req, res);

      expect(mockTransaction.rollback).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Không thể xóa danh mục có chứa danh mục con'
      });
    });

    it('should handle products assigned to category without move_to_category_id', async () => {
      req.params = { id: 1 };
      mockCategory.findByPk.mockResolvedValueOnce({ id: 1 });
      mockCategory.count.mockResolvedValueOnce(0); // No children
      mockProduct.count.mockResolvedValueOnce(5); // Has products
      
      await categoryController.deleteCategory(req, res);
      
      expect(mockTransaction.rollback).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        products_count: 5
      }));
    });

    it('should delete category successfuly when empty', async () => {
      req.params = { id: 1 };
      const destroyMock = jest.fn();
      mockCategory.findByPk.mockResolvedValueOnce({ id: 1, destroy: destroyMock });
      mockCategory.count.mockResolvedValueOnce(0); // No children
      mockProduct.count.mockResolvedValueOnce(0); // No products

      await categoryController.deleteCategory(req, res);

      expect(destroyMock).toHaveBeenCalled();
      expect(mockTransaction.commit).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Xóa danh mục thành công'
      });
    });
  });
});
