// app/sitemap.xml/route.js
import { NextResponse } from "next/server";

const SITE_URL = "https://mrfranchise.in";

export async function GET() {
  const sitemap = `
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>${SITE_URL}</loc>
      <changefreq>daily</changefreq>
      <priority>1.0</priority>
    </url>
    <url>
      <loc>${SITE_URL}/AllCategoryPage/allbrandlisting</loc>
      <changefreq>daily</changefreq>
      <priority>0.9</priority>
    </url>
  </urlset>`;
  
  return new NextResponse(sitemap, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
