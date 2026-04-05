import { jest } from '@jest/globals';

const mockAddressService = {
  getUserAddresses: jest.fn(),
  getAddressById: jest.fn(),
  createAddress: jest.fn(),
  updateAddress: jest.fn(),
  deleteAddress: jest.fn(),
  setDefaultAddress: jest.fn(),
};

jest.unstable_mockModule('../../src/services/address.service.js', () => ({
  default: mockAddressService,
}));

let addressController;
beforeAll(async () => {
  addressController = await import('../../src/controllers/address.controller.js');
});

describe('Address Controller Unit Tests', () => {
  let req, res;

  beforeEach(() => {
    req = { user: { id: 1 }, body: {}, params: {}, query: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    jest.clearAllMocks();
  });

  describe('getUserAddresses', () => {
    it('should return all addresses for user', async () => {
      const mockAddresses = [{ id: 1, address_line: '123 St' }];
      mockAddressService.getUserAddresses.mockResolvedValueOnce(mockAddresses);

      await addressController.getUserAddresses(req, res);

      expect(mockAddressService.getUserAddresses).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: mockAddresses });
    });
  });

  describe('createAddress', () => {
    it('should create address and return 201', async () => {
      req.body = { address: 'New St' };
      const mockAddress = { id: 1, address: 'New St' };
      mockAddressService.createAddress.mockResolvedValueOnce(mockAddress);

      await addressController.createAddress(req, res);

      expect(mockAddressService.createAddress).toHaveBeenCalledWith(1, req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: mockAddress });
    });
  });

  describe('deleteAddress', () => {
    it('should delete address successfully', async () => {
      req.params = { id: 1 };
      mockAddressService.deleteAddress.mockResolvedValueOnce();

      await addressController.deleteAddress(req, res);

      expect(mockAddressService.deleteAddress).toHaveBeenCalledWith(1, 1);
      expect(res.json).toHaveBeenCalledWith({ success: true });
    });

    it('should handle default address deletion error (400)', async () => {
      req.params = { id: 1 };
      mockAddressService.deleteAddress.mockRejectedValueOnce(new Error('Không thể xóa địa chỉ mặc định'));

      await addressController.deleteAddress(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    });
  });
});
