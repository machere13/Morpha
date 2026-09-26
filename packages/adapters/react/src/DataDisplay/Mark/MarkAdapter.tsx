import type { ComponentPropsWithRef } from 'react';

export type MarkAdapterProps = Omit<ComponentPropsWithRef<'span'>, 'children'> & {
  shape?: 'circle' | 'square';
};

export function MarkAdapter({ shape = 'circle', ...props }: MarkAdapterProps) {
  return <span {...props} data-ui="mark" data-shape={shape} aria-hidden="true" />;
}
