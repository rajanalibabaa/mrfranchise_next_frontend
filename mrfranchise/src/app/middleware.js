import { NextResponse } from "next/server";

export function middleware(request) {
  const pathname = request.nextUrl.pathname;

  // Redirect old brand URLs
  if (pathname.startsWith("/franchise-business-opportunity/")) {
    const slug = pathname.split("/")[2];

    return NextResponse.redirect(
      new URL(`/brands/${slug}`, request.url),
      301
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/franchise-business-opportunity/:path*"],
};