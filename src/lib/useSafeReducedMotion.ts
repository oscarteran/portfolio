import { useReducedMotion } from "framer-motion";
import { useIsClient } from "./useIsClient";

/** The OS reduced-motion preference, but always `false` during SSR and the first
 * hydration pass. The server can't know the preference, so branching on it before
 * mount would make the first client render differ from the server's HTML and React
 * would log a hydration mismatch. */
export function useSafeReducedMotion() {
  const prefersReducedMotion = useReducedMotion();
  const isClient = useIsClient();
  return isClient && Boolean(prefersReducedMotion);
}
