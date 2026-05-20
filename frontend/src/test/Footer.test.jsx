import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from '../components/Footer';

describe('Footer', () => {
  it('renders the Noted brand name', () => {
    render(<Footer />);
    expect(screen.getByText('Noted.')).toBeInTheDocument();
  });

  it('renders the copyright text with current year', () => {
    render(<Footer />);
    const year = new Date().getFullYear();
    expect(screen.getByText(new RegExp(year.toString()))).toBeInTheDocument();
  });

  it('renders React tech badge', () => {
    render(<Footer />);
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('renders Node.js tech badge', () => {
    render(<Footer />);
    expect(screen.getByText('Node.js')).toBeInTheDocument();
  });

  it('renders MongoDB tech badge', () => {
    render(<Footer />);
    expect(screen.getByText('MongoDB')).toBeInTheDocument();
  });
});