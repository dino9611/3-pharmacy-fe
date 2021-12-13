import { useCallback } from 'react';

export default function useDebounce(fn, delay, immediate) {
  let cb;
  if (Array.isArray(fn)) cb = Function.debounce(fn[0], fn[1], delay);
  else cb = fn.debouncify(delay, immediate);

  return useCallback(cb, []); // eslint-disable-line react-hooks/exhaustive-deps
}
