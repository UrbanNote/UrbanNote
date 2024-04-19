/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

// A nice to have in the future would be adding options for custom (de)serialization, custom logging and disabling sync, but this will do for now.
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? (JSON.parse(storedValue) as T) : initialValue;
  });

  // Handle manual value change
  useEffect(() => {
    const oldValue = localStorage.getItem(key);
    const newValue = JSON.stringify(value);

    if (oldValue === newValue) {
      return;
    }

    localStorage.setItem(key, newValue);

    // Dispatch event to other tabs as well
    dispatchEvent(
      new StorageEvent('storage', {
        storageArea: localStorage,
        url: window.location.href,
        key,
        oldValue,
        newValue,
      }),
    );
  }, [value]);

  // Handle storage value change
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key) {
        setValue((JSON.parse(event.newValue || 'null') as T) ?? initialValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [value, setValue]);

  return [value, setValue];
}
