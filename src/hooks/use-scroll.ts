import { useEffect, useState } from "react";

/** Returns 0 for all scroll offsets when prefers-reduced-motion is active. */
export function useScrollY() {
  const [y, setY] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const shouldReduce = () => mq.matches;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setY(shouldReduce() ? 0 : window.scrollY));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const onMqChange = () => {
      if (shouldReduce()) setY(0);
    };
    mq.addEventListener("change", onMqChange);

    return () => {
      window.removeEventListener("scroll", onScroll);
      mq.removeEventListener("change", onMqChange);
      cancelAnimationFrame(raf);
    };
  }, []);

  return y;
}
