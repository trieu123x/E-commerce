import { jest } from '@jest/globals';

const mockReviewService = {
  getReviewsByProductId: jest.fn(),
  createReview: jest.fn(),
  deleteReview: jest.fn(),
  updateReview: jest.fn(),
  getReviewsByUser: jest.fn(),
};

jest.unstable_mockModule('../../src/services/review.service.js', () => ({
  default: mockReviewService,
}));

let reviewController;
beforeAll(async () => {
  reviewController = await import('../../src/controllers/review.controller.js');
});

describe('Review Controller Unit Tests', () => {
  let req, res;

  beforeEach(() => {
    req = { user: { id: 1 }, body: {}, params: {}, query: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    jest.clearAllMocks();
  });

  describe('getReviewsByProduct', () => {
    it('should return reviews for product', async () => {
      req.params = { product_id: 1 };
      const mockResult = { reviews: [], pagination: {} };
      mockReviewService.getReviewsByProductId.mockResolvedValueOnce(mockResult);

      await reviewController.getReviewsByProduct(req, res);

      expect(mockReviewService.getReviewsByProductId).toHaveBeenCalledWith(1, expect.any(Object));
      expect(res.json).toHaveBeenCalledWith({ success: true, reviews: [], pagination: {} });
    });
  });

  describe('createReview', () => {
    it('should create review and return success', async () => {
      req.body = { product_id: 1, rating: 5, comment: 'Good' };
      const mockReview = { id: 1, ...req.body };
      mockReviewService.createReview.mockResolvedValueOnce(mockReview);

      await reviewController.createReview(req, res);

      expect(mockReviewService.createReview).toHaveBeenCalledWith(1, expect.objectContaining(req.body));
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Đã tạo đánh giá thành công',
        review: mockReview
      });
    });

    it('should return 403 if user has not purchased product', async () => {
      req.body = { product_id: 1 };
      mockReviewService.createReview.mockRejectedValueOnce(new Error('Bạn chỉ có thể đánh giá sản phẩm đã mua'));

      await reviewController.createReview(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
    });
  });
});
