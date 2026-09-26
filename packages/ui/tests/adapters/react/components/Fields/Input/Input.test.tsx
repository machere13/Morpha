import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it } from 'vitest';
import { Input } from '@dreadnought/ui/react';

afterEach(cleanup);

it('composes styled and consumer classes while preserving adapter semantics', () => {
  render(<Input aria-label="Search" type="search" invalid className="custom" />);
  const input = screen.getByRole('searchbox', { name: 'Search' });
  expect(input.parentElement?.classList.contains('custom')).toBe(true);
  expect(input.parentElement?.classList.contains('dreadnought-text-input')).toBe(true);
  expect(input.getAttribute('aria-invalid')).toBe('true');
});

it('uses eye icons for password visibility without visible button text', async () => {
  const user = userEvent.setup();
  render(<Input type="password" aria-label="Password" passwordVisibilityLabels={{ show: 'Показать пароль', hide: 'Скрыть пароль' }} />);
  const show = screen.getByRole('button', { name: 'Показать пароль' });
  expect(show.querySelector('svg')).not.toBeNull();
  expect(show.textContent).toBe('');
  await user.click(show);
  expect(screen.getByRole('button', { name: 'Скрыть пароль' }).querySelector('svg')).not.toBeNull();
});
