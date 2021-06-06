import { useState, useEffect } from "react";

export function useDebounce<I, O>(
  value: I,
  delay: number,
  transform: (input: I) => O,
  leading = false
): O {
  const [debouncedValue, setDebounceValue] = useState(transform(value));
  const [leadingEdge, setLeadingEdge] = useState(false);

  useEffect(() => {
    if (debouncedValue === transform(value)) {
      return;
    }
    if (leading && leadingEdge) {
      setLeadingEdge(false);
      setDebounceValue(transform(value));
      console.log("set lead");
    }
  }, [debouncedValue, value, transform, leading, leadingEdge]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceValue(transform(value));
      setLeadingEdge(true);
      console.log("set effect");
    }, delay);

    return (): void => {
      clearTimeout(handler);
    };
  }, [value, delay, transform]);

  return debouncedValue;
}
