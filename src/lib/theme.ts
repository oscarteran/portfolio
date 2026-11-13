/** Inline <head> script that runs before first paint: the saved choice wins, otherwise it
 * follows the OS setting. Pair it with suppressHydrationWarning on <html>. */
export const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;
