import type { ComponentPropsWithRef } from 'react';
import { useTabsContext } from './TabsContext.tsx';

export type TabsListAdapterProps = ComponentPropsWithRef<'div'>;

export function TabsListAdapter({ ref, ...props }: TabsListAdapterProps) {
  useTabsContext();
  return <div {...props} ref={ref} role="tablist" aria-orientation="horizontal" data-slot="list" />;
}
