import { cleanup, render } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import { MarkAdapter } from '../../../src/DataDisplay/Mark/MarkAdapter.tsx';

afterEach(cleanup);

it('renders a decorative mark with the requested shape', () => {
  const { container } = render(<MarkAdapter shape="square" />);
  const mark = container.querySelector('[data-ui="mark"]');
  expect(mark?.getAttribute('data-shape')).toBe('square');
  expect(mark?.getAttribute('aria-hidden')).toBe('true');
  expect(mark?.textContent).toBe('');
});
