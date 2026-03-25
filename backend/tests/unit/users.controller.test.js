import { jest } from '@jest/globals';

const mockPool = {
  query: jest.fn()
};

jest.unstable_mockModule('../../src/config/db.js', () => ({
  default: mockPool
}));

let usersController;
beforeAll(async () => {
  usersController = await import('../../src/controllers/users.controller.js');
});

describe('Users Controller Unit Tests', () => {
  let req, res;
  beforeEach(() => {
    req = {};
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should return all users and 200', async () => {
      mockPool.query.mockResolvedValueOnce({ rows: [{ id: 1, name: 'User 1' }] });
      
      await usersController.getAllUsers(req, res);
      
      expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM users');
      expect(res.json).toHaveBeenCalledWith([{ id: 1, name: 'User 1' }]);
    });

    it('should handle errors and return 500', async () => {
      mockPool.query.mockRejectedValueOnce(new Error('DB Failed'));
      await usersController.getAllUsers(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
  });
});
