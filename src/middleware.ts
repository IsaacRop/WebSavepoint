import { NextRequest, NextResponse } from "next/server";

const PROTECTED = ["/feed", "/library", "/games", "/profile", "/lists", "/friends", "/settings"];
const AUTH_ONLY = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("savepoint_access")?.value;

  const isProtected = PROTECTED.some((path) => pathname.startsWith(path));
  const isAuthOnly = AUTH_ONLY.some((path) => pathname.startsWith(path));

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthOnly && token) {
    return NextResponse.redirect(new URL("/feed", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
