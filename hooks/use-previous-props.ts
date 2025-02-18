import { useEffect, useRef } from "react";

export default function usePreviousProps<K = any>(value: K) {
  const ref = useRef<K>(null);

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}
