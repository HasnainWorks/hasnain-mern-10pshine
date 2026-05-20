import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { stripHtml, highlight } from '../components/notes/notesUtils.jsx';

describe('stripHtml', () => {
  it('removes HTML tags from a string', () => {
    expect(stripHtml('<p>Hello World</p>')).toBe('Hello World');
  });

  it('removes nested HTML tags', () => {
    expect(stripHtml('<div><strong>Bold</strong> text</div>')).toBe('Bold text');
  });

  it('returns empty string for null', () => {
    expect(stripHtml(null)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(stripHtml(undefined)).toBe('');
  });

  it('returns plain text unchanged', () => {
    expect(stripHtml('Just plain text')).toBe('Just plain text');
  });
});

describe('highlight', () => {
  it('returns original text when query is empty', () => {
    const result = highlight('Hello World', '');
    expect(result).toBe('Hello World');
  });

  it('returns original text when query is only spaces', () => {
    const result = highlight('Hello World', '   ');
    expect(result).toBe('Hello World');
  });

  it('wraps matched text in a mark element', () => {
    const result = highlight('Hello World', 'World');
    const { container } = render(<>{result}</>);
    const mark = container.querySelector('mark');
    expect(mark).toBeInTheDocument();
    expect(mark.textContent).toBe('World');
  });

  it('is case insensitive', () => {
    const result = highlight('Hello World', 'hello');
    const { container } = render(<>{result}</>);
    const mark = container.querySelector('mark');
    expect(mark).toBeInTheDocument();
    expect(mark.textContent.toLowerCase()).toBe('hello');
  });
});