"use client";

import { useEffect, useState } from "react";

export type ScreenSize = "2xl" | "xl" | "lg" | "md" | "mb";

export const useMedia = (): ScreenSize => {
  const [screenSize, setScreenSize] = useState<ScreenSize>("md");
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1536) setScreenSize("2xl");
      else if (width >= 1280) setScreenSize("xl");
      else if (width >= 1024) setScreenSize("lg");
      else if (width >= 768) setScreenSize("md");
      else setScreenSize("mb");
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return screenSize;
};
