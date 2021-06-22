import { useRef, useEffect } from 'react';

export function useInterval(
  callback: () => void,
  delay: number | null,
  runImmediately = false
): void {
  const savedCallback = useRef(callback);
  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  // Set up the interval.
  useEffect(() => {
    if (delay === null) {
      return;
    }
    const tick = () => savedCallback.current();
    runImmediately && tick();

    const id = setInterval(tick, delay);

    return () => clearInterval(id);
  }, [delay]);
}
