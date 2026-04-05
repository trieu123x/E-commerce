import { jest } from '@jest/globals';

const mockCartService = {
  getCart: jest.fn(),
  addToCart: jest.fn(),
  updateCartItem: jest.fn(),
  removeFromCart: jest.fn(),
  clearCart: jest.fn(),
  getCartCount: jest.fn(),
};

jest.unstable_mockModule('../../src/services/cart.service.js', () => ({
  default: mockCartService,
}));

let cartController;
beforeAll(async () => {
  cartController = await import('../../src/controllers/cart.controller.js');
});

describe('Cart Controller Unit Tests', () => {
  let req, res;

  beforeEach(() => {
    req = { user: { id: 1 }, body: {}, params: {}, query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('getCart', () => {
    it('should return cart data', async () => {
      const mockResult = {
        items: [],
        summary: { totalPrice: 0, totalItems: 0 }
      };
      mockCartService.getCart.mockResolvedValueOnce(mockResult);
      
      await cartController.getCart(req, res);
      
      expect(mockCartService.getCart).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        cart: mockResult
      });
    });
  });

  describe('addToCart', () => {
    it('should add item and return 201', async () => {
      req.body = { productId: 1, quantity: 1 };
      mockCartService.addToCart.mockResolvedValueOnce({ id: 1, product_id: 1, quantity: 1 });
      
      await cartController.addToCart(req, res);
      
      expect(mockCartService.addToCart).toHaveBeenCalledWith(1, 1, 1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });

    it('should handle product not found (404)', async () => {
      req.body = { productId: 1, quantity: 1 };
      mockCartService.addToCart.mockRejectedValueOnce(new Error('Sản phẩm không tồn tại hoặc không khả dụng'));
      
      await cartController.addToCart(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should handle out of stock (400)', async () => {
      req.body = { productId: 1, quantity: 10 };
      mockCartService.addToCart.mockRejectedValueOnce(new Error('Số lượng sản phẩm trong kho không đủ'));
      
      await cartController.addToCart(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('updateCartItem', () => {
    it('should update item and return 200', async () => {
      req.params = { itemId: 1 };
      req.body = { quantity: 2 };
      mockCartService.updateCartItem.mockResolvedValueOnce({ id: 1, quantity: 2 });
      
      await cartController.updateCartItem(req, res);
      
      expect(mockCartService.updateCartItem).toHaveBeenCalledWith(1, 1, 2);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });
  });

  describe('removeFromCart', () => {
    it('should delete item and return 200', async () => {
      req.params = { itemId: 1 };
      mockCartService.removeFromCart.mockResolvedValueOnce();
      
      await cartController.removeFromCart(req, res);
      
      expect(mockCartService.removeFromCart).toHaveBeenCalledWith(1, 1);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });
  });

  describe('getCartCount', () => {
    it('should return cart count', async () => {
      mockCartService.getCartCount.mockResolvedValueOnce(5);
      
      await cartController.getCartCount(req, res);
      
      expect(mockCartService.getCartCount).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true, count: 5 }));
    });
  });
});
