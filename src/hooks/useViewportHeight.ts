import { useEffect, useState } from "react";

/**
 * Real visible height of the browser viewport.
 * On phones the on-screen keyboard shrinks the visual viewport — using this
 * value keeps the chat header and the message box on screen instead of
 * letting the page scroll away.
 */
export function useViewportHeight() {
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    const vv = window.visualViewport;
    const apply = () => setHeight(Math.round(vv?.height ?? window.innerHeight));
    apply();
    vv?.addEventListener("resize", apply);
    vv?.addEventListener("scroll", apply);
    window.addEventListener("resize", apply);
    window.addEventListener("orientationchange", apply);
    return () => {
      vv?.removeEventListener("resize", apply);
      vv?.removeEventListener("scroll", apply);
      window.removeEventListener("resize", apply);
      window.removeEventListener("orientationchange", apply);
    };
  }, []);

  return height;
}
