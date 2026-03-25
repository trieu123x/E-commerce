import { jest } from '@jest/globals';
import request from 'supertest';
import bcrypt from 'bcrypt';

const mockDbQuery = jest.fn();

// Mock database globally before importing app
jest.unstable_mockModule('../../src/config/db.js', () => ({
  default: { query: mockDbQuery },
}));

let app;

beforeAll(async () => {
  app = (await import('../../src/app.js')).default;
});

describe('Auth Routes Integration Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should return 400 for incomplete data', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@example.com' });
      
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('messsage', 'Thiếu thông tin'); // Typo matching controller
    });

    it('should successfully register and return 201', async () => {
      // Setup DB mocks:
      // 1. Check existing user (returns empty)
      mockDbQuery.mockResolvedValueOnce({ rows: [] });
      // 2. Insert user (returns inserted user row)
      mockDbQuery.mockResolvedValueOnce({
        rows: [{ id: 1, email: 'new@example.com', full_name: 'New User', role: 'user' }]
      });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'new@example.com',
          password: 'securepassword',
          fullName: 'New User'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Đăng ký thành công');
      expect(res.body.user).toHaveProperty('email', 'new@example.com');
      
      expect(mockDbQuery).toHaveBeenCalledTimes(2);
    });

    it('should fail with 409 if email already exists in DB', async () => {
      // DB mock to simulate an existing user
      mockDbQuery.mockResolvedValueOnce({ rows: [{ id: 1 }] });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'exist@example.com',
          password: 'securepassword',
          fullName: 'Exist User'
        });

      expect(res.status).toBe(409);
      expect(res.body.message).toBe('Email đã được sử dụng');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should successfully login and return a token', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      mockDbQuery.mockResolvedValueOnce({
        rows: [{
          id: 1,
          email: 'login@example.com',
          password_hash: hashedPassword,
          status: 'ACTIVE',
          role: 'user',
          full_name: 'Login User'
        }]
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('email', 'login@example.com');
    });

    it('should fail with 401 for incorrect password', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      mockDbQuery.mockResolvedValueOnce({
        rows: [{
          id: 1,
          email: 'login@example.com',
          password_hash: hashedPassword,
          status: 'ACTIVE'
        }]
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'wrongpassword'
        });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Sai email hoặc mật khẩu');
    });
  });
});
