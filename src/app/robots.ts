import type { MetadataRoute } from "next";
import { getSite } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", getSite("es").url).toString(),
  };
}
