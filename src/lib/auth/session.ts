import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import type { UserProfile } from "@/models/user.model";
import { ApiError, createApiUrl } from "@/services/api.service";

export const SESSION_COOKIE_NAME = "shopwave_session";

const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

async function readResponseBody(response: Response) {
	if (response.status === 204) {
		return null;
	}

	const text = await response.text();

	if (!text) {
		return null;
	}

	const contentType = response.headers.get("content-type") ?? "";

	if (contentType.includes("application/json")) {
		return JSON.parse(text) as unknown;
	}

	return text;
}

export function createSessionCookieValue(jwt: string) {
	return jwt.trim();
}

export function createSessionCookieOptions() {
	return {
		httpOnly: true,
		sameSite: "lax" as const,
		secure: process.env.NODE_ENV === "production",
		path: "/",
		maxAge: SESSION_COOKIE_MAX_AGE,
	};
}

export async function getSessionToken() {
	const cookieStore = await cookies();
	return cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
}

export async function clearSessionCookie() {
	const cookieStore = await cookies();
	cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function setSessionCookie(jwt: string) {
	const cookieStore = await cookies();
	cookieStore.set(
		SESSION_COOKIE_NAME,
		createSessionCookieValue(jwt),
		createSessionCookieOptions(),
	);
}

export async function getUserProfileFromToken(jwt: string): Promise<UserProfile> {
	const response = await fetch(createApiUrl("/users/profile"), {
		cache: "no-store",
		headers: {
			Accept: "application/json",
			Authorization: jwt,
		},
	});
	const body = await readResponseBody(response);

	if (!response.ok) {
		throw new ApiError("/users/profile", response.status, body);
	}

	return body as UserProfile;
}

export async function getCurrentUser() {
	const token = await getSessionToken();

	if (!token) {
		return null;
	}

	try {
		return await getUserProfileFromToken(token);
	} catch {
		await clearSessionCookie();
		return null;
	}
}

export async function requireAuthenticatedUser(redirectTo?: string) {
	const user = await getCurrentUser();

	if (!user) {
		redirect(redirectTo ?? "/login");
	}

	return user;
}

export async function requireAdminUser() {
	const user = await requireAuthenticatedUser("/login");

	if (user.role !== "ROLE_ADMIN") {
		redirect("/");
	}

	return user;
}
