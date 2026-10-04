import { Barlow, Barlow_Condensed } from "next/font/google";

export const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const fontVariables = `${barlow.variable} ${barlowCondensed.variable}`;
