import { jest } from '@jest/globals';

// Mock DB
const mockOrderInstance = {
  update: jest.fn().mockReturnThis()
};
const mockProductInstance = {
  increment: jest.fn().mockReturnThis()
};

const mockOrder = {
  findByPk: jest.fn(),
  update: jest.fn()
};
const mockOrderItem = {
  findAll: jest.fn()
};
const mockProduct = {
  findByPk: jest.fn()
};

const mockTransaction = {
  commit: jest.fn(),
  rollback: jest.fn()
};

const mockDb = {
  Order: mockOrder,
  OrderItem: mockOrderItem,
  Product: mockProduct,
  sequelize: {
    transaction: jest.fn(() => mockTransaction)
  }
};

jest.unstable_mockModule('../../models/index.js', () => ({ default: mockDb }));

let orderService;

beforeAll(async () => {
  const module = await import('../../src/services/order.service.js');
  orderService = module.default;
});

describe('OrderService Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('completeOrder', () => {
    it('should update order status to completed', async () => {
      await orderService.completeOrder(1);
      expect(mockOrder.update).toHaveBeenCalledWith(
        { status: 'COMPLETED' },
        { where: { id: 1 } }
      );
    });
  });

  describe('cancelOrder', () => {
    it('should update status to cancelled and restore stock', async () => {
      const mockItems = [
        { product_id: 101, quantity: 2 },
        { product_id: 102, quantity: 1 }
      ];
      
      const mockOrderWithItems = {
        ...mockOrderInstance,
        id: 1,
        status: 'PENDING',
        items: mockItems,
        update: jest.fn().mockResolvedValue(true)
      };

      mockOrder.findByPk.mockResolvedValue(mockOrderWithItems);
      mockProduct.findByPk.mockResolvedValue(mockProductInstance);

      const result = await orderService.cancelOrder(1);

      expect(result.success).toBe(true);
      expect(mockOrder.update).toHaveBeenCalledWith(
        { status: 'CANCELLED' },
        { where: { id: 1 }, transaction: mockTransaction }
      );
      expect(mockProductInstance.increment).toHaveBeenCalledTimes(2);
      expect(mockProductInstance.increment).toHaveBeenCalledWith('stock', { by: 2, transaction: mockTransaction });
      expect(mockTransaction.commit).toHaveBeenCalled();
    });

    it('should not restore stock if already cancelled', async () => {
      const mockOrderCancelled = {
        id: 1,
        status: 'CANCELLED'
      };
      mockOrder.findByPk.mockResolvedValue(mockOrderCancelled);

      const result = await orderService.cancelOrder(1);

      expect(result.message).toBe('Order already cancelled');
      expect(mockTransaction.rollback).toHaveBeenCalled();
    });
  });
});
