import { jest } from '@jest/globals';

const mockReview = { create: jest.fn(), findOne: jest.fn(), findAll: jest.fn(), destroy: jest.fn(), save: jest.fn() };
const mockOrderItem = { findOne: jest.fn() };
const mockDb = { Review: mockReview, OrderItem: mockOrderItem, Order: {}, User: {}, Product: {} };

jest.unstable_mockModule('../../models/index.js', () => ({ default: mockDb }));

let reviewController;
beforeAll(async () => {
  reviewController = await import('../../src/controllers/review.controller.js');
});

describe('Review Controller Unit Tests', () => {
  let req, res;
  beforeEach(() => {
    req = { user: { id: 1 }, body: {}, params: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    jest.clearAllMocks();
  });

  describe('createReview', () => {
    it('should return 403 if user has not purchased', async () => {
      req.params = { product_id: 1 };
      mockOrderItem.findOne.mockResolvedValueOnce(null);
      await reviewController.createReview(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('should return 400 if already reviewed', async () => {
      req.params = { product_id: 1 };
      mockOrderItem.findOne.mockResolvedValueOnce({ id: 1 }); // Purchased
      mockReview.findOne.mockResolvedValueOnce({ id: 1 }); // Already reviewed
      await reviewController.createReview(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should create review', async () => {
      req.params = { product_id: 1 };
      req.body = { rating: 5, comment: 'Great' };
      mockOrderItem.findOne.mockResolvedValueOnce({ id: 1 }); // Purchased
      mockReview.findOne
        .mockResolvedValueOnce(null) // Not reviewed yet
        .mockResolvedValueOnce({ id: 1, rating: 5, user: { full_name: 'A' } }); // Created review with user

      mockReview.create.mockResolvedValueOnce({ id: 1 });

      await reviewController.createReview(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });
  });
});
