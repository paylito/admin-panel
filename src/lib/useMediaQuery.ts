import { useEffect, useState } from 'react';

/** Subscribe to a media query and re-render when it changes. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    setMatches(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/** Mobile breakpoint used across the dashboard (tables → cards, nav labels hidden). */
export const MOBILE_QUERY = '(max-width: 760px)';

export function useIsMobile(): boolean {
  return useMediaQuery(MOBILE_QUERY);
}
