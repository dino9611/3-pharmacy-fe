import { useCallback } from 'react';

export default function useDebounce(fn, delay, immediate) {
  let timeoutID;

  // prettier-ignore
  return useCallback( // eslint-disable-line react-hooks/exhaustive-deps
    immediate // ! immediate debounce
      ? function returnFunc() {
          if (!timeoutID) {
            fn.call(this, ...arguments);
          }
          clearTimeout(timeoutID);
          timeoutID = setTimeout(() => {
            timeoutID = false;
          }, delay);
        }
      : // ! normal debounce
        function returnFunc() {
          clearTimeout(timeoutID);
          timeoutID = setTimeout(fn.bind(this, ...arguments), delay);
        },
    []
  );
}
