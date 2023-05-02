import { ForwardedRef, useEffect, useRef } from "react";

// prettier-ignore
const useForwardRef = <T,>(ref: ForwardedRef<T>, initialValue: any = null) => {
  const targetRef = useRef<T>(initialValue);

  useEffect(() => {
    if (!ref) return;

    if (typeof ref === "function") {
      ref(targetRef.current);
    } else if (ref.current) {
      targetRef.current = ref.current;
    }
  }, [ref]);

  return targetRef;
};

export default useForwardRef;
