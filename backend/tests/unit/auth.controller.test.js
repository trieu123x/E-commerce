import { jest } from '@jest/globals';

const mockAuthService = {
  register: jest.fn(),
  login: jest.fn(),
  changePassword: jest.fn(),
  forgotPassword: jest.fn(),
  resetPassword: jest.fn(),
};

const mockUserService = {
  getUserById: jest.fn(),
  updateProfile: jest.fn(),
};

jest.unstable_mockModule('../../src/services/auth.service.js', () => ({
  default: mockAuthService,
}));

jest.unstable_mockModule('../../src/services/user.service.js', () => ({
  default: mockUserService,
}));

// Dynamic imports after mock
let authController;

describe('Auth Controller Unit Tests', () => {
  let req, res;

  beforeAll(async () => {
    authController = await import('../../src/controllers/auth.controller.js');
  });

  beforeEach(() => {
    req = { body: {}, params: {}, query: {}, user: {} };
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
      expect(res.json).toHaveBeenCalledWith({ message: 'Thiếu thông tin' });
    });

    it('should return 409 if email already exists', async () => {
      req.body = { email: 'test@example.com', password: 'password123', fullName: 'Test Name' };
      mockAuthService.register.mockRejectedValueOnce(new Error('Email đã được sử dụng'));
      
      await authController.register(req, res);
      
      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ message: 'Email đã được sử dụng' });
    });

    it('should successfully register a new user and return 201', async () => {
      req.body = { email: 'test@example.com', password: 'password123', fullName: 'Test Name' };
      const mockUser = { id: 1, email: 'test@example.com', full_name: 'Test Name', role: 'user' };
      mockAuthService.register.mockResolvedValueOnce(mockUser);

      await authController.register(req, res);

      expect(mockAuthService.register).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        fullName: 'Test Name'
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Đăng ký thành công',
        user: mockUser
      });
    });
  });

  describe('login', () => {
    it('should return 401 if user not found', async () => {
      req.body = { email: 'wrong@example.com', password: 'password123' };
      mockAuthService.login.mockRejectedValueOnce(new Error('Sai email hoặc mật khẩu'));

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Sai email hoặc mật khẩu' });
    });

    it('should return 403 if user is locked', async () => {
      req.body = { email: 'locked@example.com', password: 'password123' };
      mockAuthService.login.mockRejectedValueOnce(new Error('Tài khoản bị khóa'));

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Tài khoản bị khóa' });
    });

    it('should successfully login and return token', async () => {
      req.body = { email: 'user@example.com', password: 'password123' };
      const mockResult = {
        token: 'mocked.jwt.token',
        user: { id: 1, email: 'user@example.com', fullName: 'John', role: 'user' }
      };
      mockAuthService.login.mockResolvedValueOnce(mockResult);

      await authController.login(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Đăng nhập thành công',
        ...mockResult
      });
    });
  });
});
