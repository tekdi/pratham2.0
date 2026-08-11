import { useCallback, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'topCardsAccordionOpen';

// Not included in preserveLocalStorage()'s keep-list (src/utils/helper.ts), so
// logout's localStorage.clear() wipes this key — the next login naturally
// starts fresh (defaultOpen) without any explicit reset wiring.
const listeners = new Set<() => void>();

const readStoredValue = (): boolean => {
  if (typeof window === 'undefined') return true;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === null ? true : stored === 'true';
};

let cachedValue = readStoredValue();

const subscribe = (onStoreChange: () => void) => {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
};

const getSnapshot = () => cachedValue;
const getServerSnapshot = () => true;

const setSharedAccordionOpen = (value: boolean) => {
  cachedValue = value;
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, String(value));
  }
  listeners.forEach((listener) => listener());
};

export const useSharedAccordionState = (): [boolean, (value: boolean) => void] => {
  const isOpen = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setIsOpen = useCallback((value: boolean) => {
    setSharedAccordionOpen(value);
  }, []);

  return [isOpen, setIsOpen];
};
