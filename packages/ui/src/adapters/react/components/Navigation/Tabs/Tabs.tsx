import {
  TabsAdapter,
  TabsListAdapter,
  TabsTabAdapter,
  TabsPanelAdapter,
} from '@dreadnought/react/unstyled';
import type {
  TabsAdapterProps,
  TabsListAdapterProps,
  TabsTabAdapterProps,
  TabsPanelAdapterProps,
} from '@dreadnought/react/unstyled';
import { tabsPresentation } from '#presentation/Navigation/Tabs/tabsPresentation.ts';

function classes(library: string, consumer?: string) {
  return [library, consumer].filter(Boolean).join(' ');
}

function TabsRoot({ className, ...props }: TabsAdapterProps) {
  return <TabsAdapter {...props} className={classes(tabsPresentation.root, className)} />;
}

function List({ className, ...props }: TabsListAdapterProps) {
  return <TabsListAdapter {...props} className={classes(tabsPresentation.list, className)} />;
}

function Tab({ className, ...props }: TabsTabAdapterProps) {
  return <TabsTabAdapter {...props} className={classes(tabsPresentation.tab, className)} />;
}

function Panel({ className, ...props }: TabsPanelAdapterProps) {
  return <TabsPanelAdapter {...props} className={classes(tabsPresentation.panel, className)} />;
}

export const Tabs = Object.assign(TabsRoot, { List, Tab, Panel });
export type TabsProps = TabsAdapterProps;
