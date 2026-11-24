// Minimal replacement for the abandoned `use-dark-mode` package (React <=16
// only). Same contract: persists to localStorage `darkMode` (read by the
// no-flash script in index.html) and toggles `dark-mode` / `light-mode` on body.
import {useCallback, useEffect, useState} from 'react';

const STORAGE_KEY = 'darkMode';

const getInitialValue = (initialState) => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored !== null) return JSON.parse(stored);
  } catch (e) {
    // ignore
  }
  if (window.matchMedia) {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    if (mql.media !== 'not all') return mql.matches;
  }
  return initialState;
};

export default function useDarkMode(initialState = false) {
  const [value, setValue] = useState(() => getInitialValue(initialState));

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch (e) {
      // ignore
    }
    const body = document.body;
    body.classList.add(value ? 'dark-mode' : 'light-mode');
    body.classList.remove(value ? 'light-mode' : 'dark-mode');
  }, [value]);

  const enable = useCallback(() => setValue(true), []);
  const disable = useCallback(() => setValue(false), []);
  const toggle = useCallback(() => setValue((v) => !v), []);

  return {value, enable, disable, toggle};
}
