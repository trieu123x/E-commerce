import { jest } from '@jest/globals';

// Mock Models
const mockOrder = { findByPk: jest.fn(), update: jest.fn() };
const mockOrderItem = { findAll: jest.fn() };
const mockProduct = { findByPk: jest.fn() };
const mockDb = { 
  Order: mockOrder, 
  OrderItem: mockOrderItem, 
  Product: mockProduct,
  sequelize: { transaction: jest.fn(() => ({ commit: jest.fn(), rollback: jest.fn() })) }
};
jest.unstable_mockModule('../../models/index.js', () => ({ default: mockDb }));

// Mock Services
const mockMomoService = { createPayment: jest.fn() };
jest.unstable_mockModule('../../src/services/momo.service.js', () => ({ createPayment: mockMomoService.createPayment }));

const mockVnpayService = { createPaymentUrl: jest.fn(), verifyCallback: jest.fn() };
jest.unstable_mockModule('../../src/services/vnpay.service.js', () => ({ default: mockVnpayService }));

const mockStripeService = { createCheckoutSession: jest.fn(), verifyWebhook: jest.fn() };
jest.unstable_mockModule('../../src/services/stripe.service.js', () => ({ default: mockStripeService }));

const mockOrderService = { completeOrder: jest.fn(), cancelOrder: jest.fn() };
jest.unstable_mockModule('../../src/services/order.service.js', () => ({ default: mockOrderService }));

let paymentController;

beforeAll(async () => {
  paymentController = await import('../../src/controllers/payment.controller.js');
});

describe('Payment Controller Unit Tests', () => {
  let req, res;

  beforeEach(() => {
    req = { 
      body: {}, 
      query: {}, 
      headers: {},
      connection: { remoteAddress: '127.0.0.1' }
    };
    res = { 
      status: jest.fn().mockReturnThis(), 
      json: jest.fn(), 
      redirect: jest.fn(),
      send: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('MoMo Payments', () => {
    it('should create MoMo payment and return payUrl', async () => {
      req.body = { orderId: '1', redirectUrl: 'http://test.com' };
      mockOrder.findByPk.mockResolvedValue({ id: 1, total_amount: 1000 });
      mockMomoService.createPayment.mockResolvedValue({ payUrl: 'http://momo.vn/pay' });
      
      await paymentController.createMomoPayment(req, res);
      
      expect(res.json).toHaveBeenCalledWith({ payUrl: 'http://momo.vn/pay' });
    });

    it('should complete order on successful MoMo return', async () => {
      req.query = { resultCode: '0', orderId: '1' };
      await paymentController.momoReturn(req, res);
      
      expect(mockOrderService.completeOrder).toHaveBeenCalledWith('1');
      expect(res.redirect).toHaveBeenCalledWith(expect.stringContaining('/completed?orderId=1'));
    });

    it('should cancel order on failed MoMo return', async () => {
      req.query = { resultCode: '99', orderId: '1' };
      await paymentController.momoReturn(req, res);
      
      expect(mockOrderService.cancelOrder).toHaveBeenCalledWith('1');
      expect(res.redirect).toHaveBeenCalledWith(expect.stringContaining('/fail?orderId=1'));
    });
  });

  describe('VNPay Payments', () => {
    it('should create VNPay payment and return payUrl', async () => {
      req.body = { orderId: '1', bankCode: 'NCB' };
      mockOrder.findByPk.mockResolvedValue({ id: 1, total_amount: 1000 });
      mockVnpayService.createPaymentUrl.mockReturnValue('http://vnpay.vn/pay');
      
      await paymentController.createVnpayPayment(req, res);
      
      expect(res.json).toHaveBeenCalledWith({ payUrl: 'http://vnpay.vn/pay' });
    });

    it('should complete order on successful VNPay return', async () => {
      req.query = { vnp_ResponseCode: '00', vnp_TxnRef: '1' };
      mockVnpayService.verifyCallback.mockReturnValue(true);
      
      await paymentController.vnpayReturn(req, res);
      
      expect(mockOrderService.completeOrder).toHaveBeenCalledWith('1');
      expect(res.redirect).toHaveBeenCalledWith(expect.stringContaining('/completed?orderId=1'));
    });

    it('should cancel order on failed VNPay return', async () => {
      req.query = { vnp_ResponseCode: '24', vnp_TxnRef: '1' };
      mockVnpayService.verifyCallback.mockReturnValue(true);
      
      await paymentController.vnpayReturn(req, res);
      
      expect(mockOrderService.cancelOrder).toHaveBeenCalledWith('1');
      expect(res.redirect).toHaveBeenCalledWith(expect.stringContaining('/fail?orderId=1'));
    });

    it('should handle VNPay IPN correctly', async () => {
      req.query = { vnp_ResponseCode: '00', vnp_TxnRef: '1' };
      mockVnpayService.verifyCallback.mockReturnValue(true);
      
      await paymentController.vnpayIPN(req, res);
      
      expect(mockOrderService.completeOrder).toHaveBeenCalledWith('1');
      expect(res.json).toHaveBeenCalledWith({ RspCode: '00', Message: 'Confirm Success' });
    });
  });

  describe('Stripe Payments', () => {
    it('should create Stripe session and return payUrl', async () => {
      req.body = { orderId: '1' };
      mockOrder.findByPk.mockResolvedValue({ id: 1, total_amount: 1000 });
      mockStripeService.createCheckoutSession.mockResolvedValue({ url: 'http://stripe.com/pay' });
      
      await paymentController.createStripePayment(req, res);
      
      expect(res.json).toHaveBeenCalledWith({ payUrl: 'http://stripe.com/pay' });
    });

    it('should handle Stripe Webhook checkout.session.completed', async () => {
      req.headers['stripe-signature'] = 'sig_123';
      req.rawBody = Buffer.from('raw_data');
      const mockEvent = {
        type: 'checkout.session.completed',
        data: { object: { metadata: { orderId: '1' } } }
      };
      mockStripeService.verifyWebhook.mockReturnValue(mockEvent);
      
      await paymentController.stripeWebhook(req, res);
      
      expect(mockOrderService.completeOrder).toHaveBeenCalledWith('1');
      expect(res.json).toHaveBeenCalledWith({ received: true });
    });

    it('should handle Stripe Webhook checkout.session.expired', async () => {
      req.headers['stripe-signature'] = 'sig_123';
      req.rawBody = Buffer.from('raw_data');
      const mockEvent = {
        type: 'checkout.session.expired',
        data: { object: { metadata: { orderId: '1' } } }
      };
      mockStripeService.verifyWebhook.mockReturnValue(mockEvent);
      
      await paymentController.stripeWebhook(req, res);
      
      expect(mockOrderService.cancelOrder).toHaveBeenCalledWith('1');
      expect(res.json).toHaveBeenCalledWith({ received: true });
    });
  });
});
