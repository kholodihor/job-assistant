import React, { useEffect, useState } from "react";

export default function useDimensions(
  containerRef: React.RefObject<HTMLElement> | null
) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef?.current) return;

    const currentRef = containerRef.current;

    function getDimensions() {
      return {
        width: currentRef?.offsetWidth || 0,
        height: currentRef?.offsetHeight || 0,
      };
    }

    let timeoutId: NodeJS.Timeout;
    const debouncedSetDimensions = (dims: {
      width: number;
      height: number;
    }) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setDimensions(dims);
      }, 100);
    };

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        debouncedSetDimensions(getDimensions());
      }
    });

    resizeObserver.observe(currentRef);
    setDimensions(getDimensions());

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.unobserve(currentRef);
      resizeObserver.disconnect();
    };
  }, [containerRef]);

  return dimensions;
}
