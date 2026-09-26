export interface TabItem {
  value: string;
  disabled?: boolean;
}

export type TabDirection = 'previous' | 'next' | 'first' | 'last';

export interface TabsCore {
  value: string;
  tabs: readonly TabItem[];
}
