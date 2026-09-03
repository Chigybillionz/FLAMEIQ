import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SECURE_ROUTES = [
  "/customer/profile",
  "/vendor/profile",
  "/customer",
  "/vendor",
];

export function proxy(request: NextRequest) {
  
  const token = request.cookies.get("flameiq_token")?.value;
  const { pathname } = request.nextUrl;

  const isSecureRoute = SECURE_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  if (isSecureRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/customer/:path*", "/vendor/:path*"],
};
