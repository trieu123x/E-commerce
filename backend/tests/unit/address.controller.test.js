import { jest } from '@jest/globals';

const mockTransaction = { commit: jest.fn(), rollback: jest.fn() };
const mockAddress = { create: jest.fn(), findAll: jest.fn(), findOne: jest.fn(), update: jest.fn(), destroy: jest.fn(), count: jest.fn() };

const mockDb = {
  Address: mockAddress,
  Sequelize: { Op: { ne: Symbol('ne') } },
  sequelize: { transaction: jest.fn(() => mockTransaction) }
};

jest.unstable_mockModule('../../models/index.js', () => ({ default: mockDb }));

let addressController;
beforeAll(async () => {
  addressController = await import('../../src/controllers/address.controller.js');
});

describe('Address Controller Unit Tests', () => {
  let req, res;
  beforeEach(() => {
    req = { user: { id: 1 }, body: {}, params: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    jest.clearAllMocks();
  });

  describe('createAddress', () => {
    it('should create an address successfully', async () => {
      req.body = { address: '123 St', district: 'D1', ward: 'W1', is_default: true };
      mockAddress.update.mockResolvedValueOnce([1]); // Clear old default
      mockAddress.create.mockResolvedValueOnce({ id: 1, ...req.body });

      await addressController.createAddress(req, res);

      expect(mockTransaction.commit).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });
  });

  describe('deleteAddress', () => {
    it('should not delete if it is the only default address', async () => {
      req.params = { id: 1 };
      mockAddress.findOne.mockResolvedValueOnce({ id: 1, is_default: true, destroy: jest.fn() });
      mockAddress.count.mockResolvedValueOnce(1); // Have other addresses

      await addressController.deleteAddress(req, res);

      expect(mockTransaction.rollback).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Không thể xóa địa chỉ mặc định' }));
    });
  });
});
