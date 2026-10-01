import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, AUTH_COOKIE } from "@/lib/auth";

// Guards the dashboard pages. The session cookie is issued by the backend API;
// the frontend verifies it here (it shares AUTH_SECRET) so /admin stays
// protected without a round-trip. API authorization itself lives in the backend.
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(AUTH_COOKIE)?.value;
  const isAuthed = await verifySessionToken(token);

  // Login page: if already signed in, go straight to the dashboard.
  if (pathname === "/naimaslogin") {
    if (isAuthed) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.next();
  }

  // Admin (dashboard) pages require auth.
  if (pathname.startsWith("/admin")) {
    if (!isAuthed) {
      return NextResponse.redirect(new URL("/naimaslogin", req.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/naimaslogin"],
};
