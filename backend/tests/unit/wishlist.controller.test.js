import { jest } from '@jest/globals';

const mockWishlistService = {
  getWishlist: jest.fn(),
  addToWishlist: jest.fn(),
  removeFromWishlist: jest.fn(),
  checkWishlistStatus: jest.fn(),
};

jest.unstable_mockModule('../../src/services/wishlist.service.js', () => ({
  default: mockWishlistService,
}));

let wishlistController;
beforeAll(async () => {
  wishlistController = await import('../../src/controllers/wishlist.controller.js');
});

describe('Wishlist Controller Unit Tests', () => {
  let req, res;

  beforeEach(() => {
    req = { user: { id: 1 }, body: {}, params: {}, query: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    jest.clearAllMocks();
  });

  describe('getWishlist', () => {
    it('should return wishlist for user', async () => {
      const mockWishlist = [{ id: 1, product_id: 1 }];
      mockWishlistService.getWishlist.mockResolvedValueOnce(mockWishlist);

      await wishlistController.getWishlist(req, res);

      expect(mockWishlistService.getWishlist).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: mockWishlist });
    });
  });

  describe('addToWishlist', () => {
    it('should add to wishlist and return 201', async () => {
      req.body = { productId: 1 };
      mockWishlistService.addToWishlist.mockResolvedValueOnce({ id: 1, product_id: 1 });

      await wishlistController.addToWishlist(req, res);

      expect(mockWishlistService.addToWishlist).toHaveBeenCalledWith(1, 1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });

    it('should return 400 if already in wishlist', async () => {
      req.body = { productId: 1 };
      mockWishlistService.addToWishlist.mockRejectedValueOnce(new Error('Sản phẩm đã có trong danh sách yêu thích'));

      await wishlistController.addToWishlist(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('removeFromWishlist', () => {
    it('should remove from wishlist and return 200', async () => {
      req.params = { productId: 1 };
      mockWishlistService.removeFromWishlist.mockResolvedValueOnce();

      await wishlistController.removeFromWishlist(req, res);

      expect(mockWishlistService.removeFromWishlist).toHaveBeenCalledWith(1, 1);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });
  });
});
