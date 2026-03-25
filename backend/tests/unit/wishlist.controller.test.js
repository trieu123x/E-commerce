import { jest } from '@jest/globals';

const mockWishlist = { create: jest.fn(), findOne: jest.fn(), destroy: jest.fn(), findAll: jest.fn() };
const mockDb = { Wishlist: mockWishlist, Product: {} };

jest.unstable_mockModule('../../models/index.js', () => ({ default: mockDb }));

let wishlistController;
beforeAll(async () => {
  wishlistController = await import('../../src/controllers/wishlist.controller.js');
});

describe('Wishlist Controller Unit Tests', () => {
  let req, res;
  beforeEach(() => {
    req = { user: { id: 1 }, body: {}, params: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    jest.clearAllMocks();
  });

  describe('addToWishlist', () => {
    it('should return 400 if product already in wishlist', async () => {
      req.body = { product_id: 1 };
      mockWishlist.findOne.mockResolvedValueOnce({ id: 1 });
      await wishlistController.addToWishlist(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Sản phẩm đã có trong danh sách yêu thích' }));
    });

    it('should add to wishlist', async () => {
      req.body = { product_id: 1 };
      mockWishlist.findOne.mockResolvedValueOnce(null);
      mockWishlist.create.mockResolvedValueOnce({ id: 1, product_id: 1 });
      await wishlistController.addToWishlist(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });
  });
});
