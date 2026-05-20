import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../pages/Login';

const mockLogin = vi.fn();
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ login: mockLogin }),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

const renderLogin = () =>
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

describe('Login Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the sign in heading', () => {
    renderLogin();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

  it('renders email input', () => {
    renderLogin();
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
  });

  it('renders the Continue button', () => {
    renderLogin();
    expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
  });

  it('renders link to signup page', () => {
    renderLogin();
    expect(screen.getByText(/Create an account/i)).toBeInTheDocument();
  });

  it('navigates to dashboard on successful login', async () => {
    mockLogin.mockResolvedValueOnce({});
    renderLogin();

    fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
      target: { value: 'test@test.com' },
    });

    const passwordInput = document.querySelector('input[type="password"]');
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@test.com', 'password123');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('shows error message on failed login', async () => {
    mockLogin.mockRejectedValueOnce({
      response: { data: { message: 'Invalid email or password' } },
    });
    renderLogin();

    fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
      target: { value: 'wrong@test.com' },
    });

    const passwordInput = document.querySelector('input[type="password"]');
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });

    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
    });
  });
});