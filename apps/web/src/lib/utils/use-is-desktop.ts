import { useEffect } from "react";
import { useDebounce } from "@react-hook/debounce";

const breakpoints = {
  desktop: "@media screen and (min-width: 900px)",
};

const isDesktop = () => {
  if (typeof window !== "undefined") {
    const mq = window.matchMedia(breakpoints.desktop.replace("@media ", ""));
    return mq.matches;
  }
  return false;
};

export const useIsDesktop = () => {
  const [desktop, setDesktop] = useDebounce(isDesktop());

  useEffect(() => {
    const onResize = () => {
      setDesktop(isDesktop());
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return desktop;
};
