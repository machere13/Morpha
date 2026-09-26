import type { TabDirection, TabItem } from './TabsCore.ts';

export function getNextTabValue(
  tabs: readonly TabItem[],
  currentValue: string,
  direction: TabDirection,
): string | undefined {
  const enabled = tabs.filter((tab) => !tab.disabled);
  if (enabled.length === 0) return undefined;
  if (direction === 'first') return enabled[0]!.value;
  if (direction === 'last') return enabled.at(-1)!.value;

  const index = enabled.findIndex((tab) => tab.value === currentValue);
  if (index < 0) return direction === 'next' ? enabled[0]!.value : enabled.at(-1)!.value;

  const offset = direction === 'next' ? 1 : -1;
  return enabled[(index + offset + enabled.length) % enabled.length]!.value;
}
