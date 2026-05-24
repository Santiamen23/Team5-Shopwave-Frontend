import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { SESSION_COOKIE_NAME } from "@/lib/auth/session";

const protectedPaths = ["/cart", "/checkout", "/orders", "/profile"];
const adminPath = "/admin";
const guestOnlyPaths = ["/login", "/register"];

function matchesPath(pathname: string, path: string) {
	return pathname === path || pathname.startsWith(`${path}/`);
}

export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const hasSession = Boolean(request.cookies.get(SESSION_COOKIE_NAME)?.value);

	if (!hasSession && protectedPaths.some((path) => matchesPath(pathname, path))) {
		const loginUrl = new URL("/login", request.url);
		loginUrl.searchParams.set("next", pathname);
		return NextResponse.redirect(loginUrl);
	}

	if (!hasSession && matchesPath(pathname, adminPath)) {
		const loginUrl = new URL("/login", request.url);
		loginUrl.searchParams.set("next", pathname);
		return NextResponse.redirect(loginUrl);
	}

	if (hasSession && guestOnlyPaths.some((path) => matchesPath(pathname, path))) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/login", "/register", "/cart/:path*", "/checkout/:path*", "/orders/:path*", "/profile/:path*", "/admin/:path*"],
};
