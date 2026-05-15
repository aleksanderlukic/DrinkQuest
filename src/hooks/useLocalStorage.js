import { useState } from 'react';
import { storage } from '../utils/localStorage';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    return storage.get(key, initialValue);
  });

  const setValue = (value) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    storage.set(key, valueToStore);
  };

  const removeValue = () => {
    setStoredValue(initialValue);
    storage.remove(key);
  };

  return [storedValue, setValue, removeValue];
}
