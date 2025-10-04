import type { MetadataRoute } from "next";
import data from "@/data/emojis.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://emojar.com";
  const gamesList = [
    "/games/xo",
    // '/games/snake',
    // '/games/minesweeper',
    // '/games/hangman',
    // '/games/bubble-shooter',
  ];

  const alphabetSorted = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
  ).map((letter) => `/sorted/alphabet#${letter.toLowerCase()}`);

  const emojiUrls = data.map((e) => ({
    url: `${base}/emoji/${e.slug}`,
    lastModified: new Date(),
  }));
  const routes = ["", "/categories", "/games"].map((r) => ({
    url: `${base}${r}`,
    lastModified: new Date(),
  }));
  gamesList.forEach((g) =>
    routes.push({ url: `${base}${g}`, lastModified: new Date() })
  );
  alphabetSorted.forEach((a) =>
    routes.push({ url: `${base}${a}`, lastModified: new Date() })
  );

  return [...routes, ...emojiUrls];
}
