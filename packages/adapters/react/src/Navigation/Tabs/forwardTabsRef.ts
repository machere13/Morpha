import type { Ref } from 'react';

export function forwardTabsRef<T>(
  element: T | null,
  consumerRef: Ref<T> | undefined,
  unregister: () => void,
): void | (() => void) {
  if (element === null) {
    if (typeof consumerRef === 'function') consumerRef(null);
    else if (consumerRef) consumerRef.current = null;
    return;
  }

  let consumerCleanup: void | (() => void);
  if (typeof consumerRef === 'function') consumerCleanup = consumerRef(element);
  else if (consumerRef) consumerRef.current = element;

  return () => {
    unregister();
    if (typeof consumerCleanup === 'function') consumerCleanup();
    else if (typeof consumerRef === 'function') consumerRef(null);
    else if (consumerRef) consumerRef.current = null;
  };
}
