import { useCallback } from 'react';
import type { ComponentPropsWithRef } from 'react';
import { useTabsContext } from './TabsContext.tsx';

export type TabsPanelAdapterProps = Omit<ComponentPropsWithRef<'div'>, 'hidden'> & {
  value: string;
};

export function TabsPanelAdapter({ value, ref, ...props }: TabsPanelAdapterProps) {
  const context = useTabsContext();
  const setRef = useCallback((element: HTMLDivElement | null) => {
    context.registerPanel(value, element);
    if (typeof ref === 'function') ref(element);
    else if (ref) ref.current = element;
  }, [context.registerPanel, ref, value]);

  const selected = context.value === value;
  return <div {...props} ref={setRef} role="tabpanel" data-slot="panel"
    id={context.panelId(value)} aria-labelledby={context.tabId(value)}
    hidden={!selected} tabIndex={selected ? 0 : undefined} />;
}
