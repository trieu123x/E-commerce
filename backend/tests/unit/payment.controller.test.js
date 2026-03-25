import { jest } from '@jest/globals';

const mockOrder = { findByPk: jest.fn(), update: jest.fn() };
const mockDb = { Order: mockOrder };
jest.unstable_mockModule('../../models/index.js', () => ({ default: mockDb }));

const mockMomoService = { createPayment: jest.fn() };
jest.unstable_mockModule('../../src/services/momo.service.js', () => mockMomoService);

let paymentController;
beforeAll(async () => {
  paymentController = await import('../../src/controllers/payment.controller.js');
});

describe('Payment Controller Unit Tests', () => {
  let req, res;
  beforeEach(() => {
    req = { body: {}, query: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn(), redirect: jest.fn() };
    jest.clearAllMocks();
  });

  describe('createMomoPayment', () => {
    it('should return 404 if order not found', async () => {
      req.body = { orderId: 1 };
      mockOrder.findByPk.mockResolvedValueOnce(null);
      await paymentController.createMomoPayment(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should return payUrl on success', async () => {
      req.body = { orderId: 1, redirectUrl: 'abc' };
      mockOrder.findByPk.mockResolvedValueOnce({ id: 1 });
      mockMomoService.createPayment.mockResolvedValueOnce({ payUrl: 'http://momo.vn' });
      await paymentController.createMomoPayment(req, res);
      expect(res.json).toHaveBeenCalledWith({ payUrl: 'http://momo.vn' });
    });
  });

  describe('momoIPN', () => {
    it('should update order status when paid', async () => {
      req.body = { orderId: 'MOMO_123', resultCode: 0 };
      await paymentController.momoIPN(req, res);
      expect(mockOrder.update).toHaveBeenCalledWith({ status: 'paid' }, { where: { id: '123' } });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'ok' });
    });
  });
});
