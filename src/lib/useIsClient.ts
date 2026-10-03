import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/** True once hydrated on the client, false during SSR and the first hydration pass.
 * Use this to gate any value the server cannot know (e.g. a media query result)
 * so the first client render matches the server's output exactly. */
export function useIsClient() {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}
