import { useCallback, useId, useLayoutEffect, useRef } from 'react';
import type { ComponentPropsWithRef, ReactNode } from 'react';
import { getNextTabValue } from '@dreadnought/core';
import type { TabDirection } from '@dreadnought/core';
import { TabsContext } from './TabsContext.tsx';
import type { RegisteredTab } from './TabsContext.tsx';
import { TabsListAdapter } from './TabsListAdapter.tsx';
import { TabsTabAdapter } from './TabsTabAdapter.tsx';
import { TabsPanelAdapter } from './TabsPanelAdapter.tsx';
import { useTabs } from './useTabs.ts';
import type { UseTabsOptions } from './useTabs.ts';

export type TabsAdapterProps = Omit<ComponentPropsWithRef<'div'>, 'defaultValue' | 'onChange' | 'children'>
  & UseTabsOptions & { children: ReactNode };

function TabsRootAdapter({ value, defaultValue, onValueChange, children, ref, ...rootProps }: TabsAdapterProps) {
  const selection = useTabs(value === undefined
    ? { defaultValue: defaultValue!, onValueChange }
    : { value, onValueChange });
  const rootId = useId();
  const tabs = useRef(new Map<string, RegisteredTab>());
  const panels = useRef(new Map<string, HTMLDivElement>());

  const tabId = useCallback((itemValue: string) => `${rootId}-tab-${encodeURIComponent(itemValue)}`, [rootId]);
  const panelId = useCallback((itemValue: string) => `${rootId}-panel-${encodeURIComponent(itemValue)}`, [rootId]);

  const registerTab = useCallback((itemValue: string, element: HTMLButtonElement | null, disabled: boolean) => {
    if (element === null) {
      tabs.current.delete(itemValue);
      return;
    }
    if (itemValue.length === 0 || (tabs.current.has(itemValue) && tabs.current.get(itemValue)?.element !== element)) {
      throw new Error(`Duplicate or empty Tabs.Tab value: ${itemValue}`);
    }
    tabs.current.set(itemValue, { value: itemValue, disabled, element });
  }, []);

  const registerPanel = useCallback((itemValue: string, element: HTMLDivElement | null) => {
    if (element === null) {
      panels.current.delete(itemValue);
      return;
    }
    if (itemValue.length === 0 || (panels.current.has(itemValue) && panels.current.get(itemValue) !== element)) {
      throw new Error(`Duplicate or empty Tabs.Panel value: ${itemValue}`);
    }
    panels.current.set(itemValue, element);
  }, []);

  const navigate = useCallback((currentValue: string, direction: TabDirection) => {
    const ordered = [...tabs.current.values()].sort((a, b) => {
      const relation = a.element.compareDocumentPosition(b.element);
      return relation & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
    });
    const next = getNextTabValue(ordered, currentValue, direction);
    if (next === undefined) return;
    tabs.current.get(next)?.element.focus();
    selection.setValue(next);
  }, [selection]);

  useLayoutEffect(() => {
    if (tabs.current.size !== panels.current.size) {
      throw new Error('Every Tabs.Tab needs one matching Tabs.Panel.');
    }
    for (const [itemValue] of tabs.current) {
      if (!panels.current.has(itemValue)) throw new Error(`Missing Tabs.Panel for ${itemValue}.`);
    }
    const selected = tabs.current.get(selection.value);
    if (!selected || selected.disabled) throw new Error(`Invalid selected Tabs value: ${selection.value}.`);
  });

  return <TabsContext.Provider value={{
    value: selection.value,
    setValue: selection.setValue,
    tabId,
    panelId,
    registerTab,
    registerPanel,
    navigate,
  }}><div {...rootProps} ref={ref} data-ui="tabs">{children}</div></TabsContext.Provider>;
}

export const TabsAdapter = Object.assign(TabsRootAdapter, {
  List: TabsListAdapter,
  Tab: TabsTabAdapter,
  Panel: TabsPanelAdapter,
});
