import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import app from '../app.js';
import * as AuthService from '../services/auth.service.js';

vi.mock('../services/auth.service.js', () => ({
  registerUser: vi.fn(),
  loginUser: vi.fn(),
}));

const mockedRegisterUser = vi.mocked(AuthService.registerUser);
const mockedLoginUser = vi.mocked(AuthService.loginUser);

describe('Auth API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('POST /api/auth/register should return 201 when register success', async () => {
    mockedRegisterUser.mockResolvedValue({
      id: 1,
      email: 'test1@gmail.com',
      username: 'testuser1',
    } as never);

    const response = await request(app).post('/api/auth/register').send({
      email: 'test1@gmail.com',
      username: 'testuser1',
      password: '123456',
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: 'Đăng ký thành công',
      user: {
        id: 1,
        email: 'test1@gmail.com',
        username: 'testuser1',
      },
    });
  });

  it('POST /api/auth/register should return 400 when service throws error', async () => {
    mockedRegisterUser.mockRejectedValue(new Error('Email đã tồn tại'));

    const response = await request(app).post('/api/auth/register').send({
      email: 'test1@gmail.com',
      username: 'testuser1',
      password: '123456',
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Email đã tồn tại' });
  });

  it('POST /api/auth/login should return 200 with token when login success', async () => {
    mockedLoginUser.mockResolvedValue({
      token: 'fake-token',
      user: { email: 'test1@gmail.com' },
    } as never);

    const response = await request(app).post('/api/auth/login').send({
      email: 'test1@gmail.com',
      password: '123456',
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Đăng nhập thành công',
      token: 'fake-token',
      user: { email: 'test1@gmail.com' },
    });
  });

  it('POST /api/auth/login should return 401 when credentials invalid', async () => {
    mockedLoginUser.mockRejectedValue(new Error('Mật khẩu sai'));

    const response = await request(app).post('/api/auth/login').send({
      email: 'test1@gmail.com',
      password: 'wrong-password',
    });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Mật khẩu sai' });
  });
});