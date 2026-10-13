const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://react-campus-lost-and-found.vercel.app"
).replace(/\/+$/, "");

export default function sitemap() {
  return [
    {
      url: SITE_URL,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/items`,
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];
}
