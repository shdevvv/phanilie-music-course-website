import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce a rapidly changing value.
 * @param value The input value to debounce.
 * @param delay Delay in milliseconds (default: 300ms).
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
