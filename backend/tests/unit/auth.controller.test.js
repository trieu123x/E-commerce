import { jest } from '@jest/globals';

// Mock dependencies required by the ES module before importing
jest.unstable_mockModule('../../src/config/db.js', () => ({
  default: { query: jest.fn() },
}));

jest.unstable_mockModule('bcrypt', () => ({
  default: { hash: jest.fn(), compare: jest.fn() },
}));

jest.unstable_mockModule('jsonwebtoken', () => ({
  default: { sign: jest.fn() },
}));

// Dynamic imports after mock
const authController = await import('../../src/controllers/auth.controller.js');
const db = (await import('../../src/config/db.js')).default;
const bcrypt = (await import('bcrypt')).default;
const jwt = (await import('jsonwebtoken')).default;

describe('Auth Controller Unit Tests', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should return 400 if missing info', async () => {
      req.body = { email: 'test@example.com' }; 
      await authController.register(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ messsage: 'Thiếu thông tin' }); // Typo in original code
    });

    it('should return 409 if email already exists', async () => {
      req.body = { email: 'test@example.com', password: 'password123', fullName: 'Test Name' };
      db.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });
      
      await authController.register(req, res);
      
      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ message: 'Email đã được sử dụng' });
      expect(db.query).toHaveBeenCalledTimes(1);
    });

    it('should successfully register a new user and return 201', async () => {
      req.body = { email: 'test@example.com', password: 'password123', fullName: 'Test Name' };
      db.query.mockResolvedValueOnce({ rows: [] }); // Check exists -> empty
      bcrypt.hash.mockResolvedValueOnce('hashedPassword123');
      db.query.mockResolvedValueOnce({
        rows: [{ id: 1, email: 'test@example.com', full_name: 'Test Name', role: 'user' }]
      }); // Insert

      await authController.register(req, res);

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Đăng ký thành công',
        user: { id: 1, email: 'test@example.com', full_name: 'Test Name', role: 'user' }
      });
    });
  });

  describe('login', () => {
    it('should return 401 if user not found', async () => {
      req.body = { email: 'wrong@example.com', password: 'password123' };
      db.query.mockResolvedValueOnce({ rows: [] });

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Sai email hoặc mật khẩu' });
    });

    it('should return 403 if user is locked', async () => {
      req.body = { email: 'locked@example.com', password: 'password123' };
      db.query.mockResolvedValueOnce({ rows: [{ id: 1, status: 'LOCKED' }] });

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Tài khoản bị khóa' });
    });

    it('should return 401 if password does not match', async () => {
      req.body = { email: 'user@example.com', password: 'wrongpassword' };
      db.query.mockResolvedValueOnce({ rows: [{ id: 1, password_hash: 'hashedPassword', status: 'ACTIVE' }] });
      bcrypt.compare.mockResolvedValueOnce(false);

      await authController.login(req, res);

      expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashedPassword');
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Sai email hoặc mật khẩu' });
    });

    it('should successfully login and return token', async () => {
      req.body = { email: 'user@example.com', password: 'password123' };
      const mockUser = {
        id: 1, email: 'user@example.com', full_name: 'John', role: 'user',
        status: 'ACTIVE', password_hash: 'hashedPassword', phone: '123', created_at: '2025'
      };
      
      db.query.mockResolvedValueOnce({ rows: [mockUser] });
      bcrypt.compare.mockResolvedValueOnce(true);
      jwt.sign.mockReturnValueOnce('mocked.jwt.token');

      await authController.login(req, res);

      expect(jwt.sign).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Đăng nhập thành công',
        token: 'mocked.jwt.token',
        user: {
          id: 1, email: 'user@example.com', fullName: 'John', role: 'user',
          phone: '123', created_at: '2025'
        }
      });
    });
  });
});
