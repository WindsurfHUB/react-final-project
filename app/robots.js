const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://react-campus-lost-and-found.vercel.app"
).replace(/\/+$/, "");

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/my-posts", "/report", "/saved"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
