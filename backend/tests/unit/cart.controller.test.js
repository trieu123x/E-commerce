import { jest } from '@jest/globals';

const mockCart = { findOrCreate: jest.fn(), findOne: jest.fn() };
const mockCartItem = { findOrCreate: jest.fn(), findByPk: jest.fn(), findOne: jest.fn(), destroy: jest.fn(), save: jest.fn() };
const mockProduct = { findByPk: jest.fn() };

const mockDb = {
  Cart: mockCart,
  CartItem: mockCartItem,
  Product: mockProduct,
  ProductImage: {},
  Sale: {}
};

jest.unstable_mockModule('../../models/index.js', () => ({ default: mockDb }));

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
    it('should return cart with calculated total', async () => {
      const mockCartData = {
        id: 1, user_id: 1,
        items: [{
          id: 1, cart_id: 1, product_id: 1, quantity: 2,
          product: { price: 100, status: 'ACTIVE', stock: 10, sales: [], name: 'Prod1', images: [] }
        }]
      };
      mockCart.findOrCreate.mockResolvedValueOnce([mockCartData, false]);
      
      await cartController.getCart(req, res);
      
      expect(mockCart.findOrCreate).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        cart: expect.objectContaining({
          summary: expect.objectContaining({
            totalPrice: 200,
            totalItems: 1
          })
        })
      }));
    });
  });

  describe('addToCart', () => {
    it('should return 404 if product inactive', async () => {
      req.body = { productId: 1, quantity: 1 };
      mockProduct.findByPk.mockResolvedValueOnce({ status: 'INACTIVE' });
      await cartController.addToCart(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should return 400 if out of stock', async () => {
      req.body = { productId: 1, quantity: 5 };
      mockProduct.findByPk.mockResolvedValueOnce({ status: 'ACTIVE', stock: 2 });
      await cartController.addToCart(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('removeFromCart', () => {
    it('should delete item and return 200', async () => {
      req.params = { itemId: 1 };
      mockCartItem.destroy.mockResolvedValueOnce(1); // 1 deleted
      await cartController.removeFromCart(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });
  });
});
