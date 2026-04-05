import { jest } from '@jest/globals';

const mockCategoryService = {
  createCategory: jest.fn(),
  getAllCategories: jest.fn(),
  getCategoryById: jest.fn(),
  updateCategory: jest.fn(),
  deleteCategory: jest.fn(),
  checkDeleteCategory: jest.fn(),
  getParentCategories: jest.fn(),
};

jest.unstable_mockModule('../../src/services/category.service.js', () => ({
  default: mockCategoryService,
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
      mockCategoryService.createCategory.mockResolvedValueOnce({ id: 1, name: 'Electronics', parent_id: null });

      await categoryController.createCategory(req, res);

      expect(mockCategoryService.createCategory).toHaveBeenCalledWith('Electronics', null);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Category created successfully',
        category: { id: 1, name: 'Electronics', parent_id: null }
      });
    });

    it('should handle internal errors and return 500', async () => {
      req.body = { name: 'Electronics' };
      mockCategoryService.createCategory.mockRejectedValueOnce(new Error('DB Error'));

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
      mockCategoryService.getAllCategories.mockResolvedValueOnce([{ id: 1, name: 'Cat1' }]);

      await categoryController.getAllCategories(req, res);

      expect(mockCategoryService.getAllCategories).toHaveBeenCalled();
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
      mockCategoryService.getCategoryById.mockRejectedValueOnce(new Error('Category not found'));

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
      mockCategoryService.deleteCategory.mockRejectedValueOnce(new Error('Category not found'));

      await categoryController.deleteCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should return 400 if category has products', async () => {
      req.params = { id: 1 };
      mockCategoryService.deleteCategory.mockRejectedValueOnce(new Error('CATEGORY_HAS_PRODUCTS:5'));

      await categoryController.deleteCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        products_count: 5
      }));
    });

    it('should delete category successfuly', async () => {
      req.params = { id: 1 };
      mockCategoryService.deleteCategory.mockResolvedValueOnce(0); // 0 products moved

      await categoryController.deleteCategory(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Xóa danh mục thành công'
      });
    });
  });
});
