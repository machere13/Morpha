import type { ComponentPropsWithRef } from 'react';

export type CardAdapterProps = ComponentPropsWithRef<'div'>;

export function CardAdapter(props: CardAdapterProps) {
  return <div {...props} />;
}
