import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '../services/authService';

vi.mock('../services/api', () => ({
  default: {
    post: vi.fn(),
  },
}));

import api from '../services/api';

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('login', () => {
    it('saves token to localStorage on successful login', async () => {
      api.post.mockResolvedValueOnce({
        data: { token: 'fake-token', user: { name: 'Hasnain' } },
      });

      await authService.login('test@test.com', 'password123');

      expect(localStorage.getItem('token')).toBe('fake-token');
    });

    it('saves user to localStorage on successful login', async () => {
      api.post.mockResolvedValueOnce({
        data: { token: 'fake-token', user: { name: 'Hasnain' } },
      });

      await authService.login('test@test.com', 'password123');

      expect(localStorage.getItem('user')).toBe(JSON.stringify({ name: 'Hasnain' }));
    });

    it('returns data from the API', async () => {
      api.post.mockResolvedValueOnce({
        data: { token: 'fake-token', user: { name: 'Hasnain' } },
      });

      const result = await authService.login('test@test.com', 'password123');
      expect(result.token).toBe('fake-token');
    });
  });

  describe('logout', () => {
    it('removes token from localStorage', () => {
      localStorage.setItem('token', 'fake-token');
      localStorage.setItem('user', JSON.stringify({ name: 'Hasnain' }));

      authService.logout();

      expect(localStorage.getItem('token')).toBeNull();
    });

    it('removes user from localStorage', () => {
      localStorage.setItem('token', 'fake-token');
      localStorage.setItem('user', JSON.stringify({ name: 'Hasnain' }));

      authService.logout();

      expect(localStorage.getItem('user')).toBeNull();
    });
  });

  describe('getMe', () => {
    it('returns null when no token exists', () => {
      const result = authService.getMe();
      expect(result).toBeNull();
    });

    it('returns null for invalid token', () => {
      localStorage.setItem('token', 'invalid.token');
      const result = authService.getMe();
      expect(result).toBeNull();
    });

    it('returns payload for valid JWT token', () => {
      const payload = { id: '123', email: 'test@test.com' };
      const fakeToken = `header.${btoa(JSON.stringify(payload))}.signature`;
      localStorage.setItem('token', fakeToken);

      const result = authService.getMe();
      expect(result.id).toBe('123');
      expect(result.email).toBe('test@test.com');
    });
  });

  describe('signup', () => {
    it('calls the signup API with correct data', async () => {
      api.post.mockResolvedValueOnce({ data: { message: 'User created' } });

      await authService.signup('Hasnain', 'test@test.com', 'password123');

      expect(api.post).toHaveBeenCalledWith('/auth/signup', {
        name: 'Hasnain',
        email: 'test@test.com',
        password: 'password123',
      });
    });

    it('returns data from signup API', async () => {
      api.post.mockResolvedValueOnce({ data: { message: 'User created' } });

      const result = await authService.signup('Hasnain', 'test@test.com', 'password123');
      expect(result.message).toBe('User created');
    });
  });
});