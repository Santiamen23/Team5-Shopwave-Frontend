import type {
	AuthPayload,
	SessionResponse,
	SignInPayload,
} from "@/models/auth.model";
import type { UserProfile } from "@/models/user.model";

import { apiProtectedJsonFetch, createJsonRequestInit } from "./api.service";

async function parseJsonResponse<T>(response: Response): Promise<T> {
	if (!response.ok) {
		const body = await response.json().catch(() => null);
		const message =
			body && typeof body === "object" && "message" in body && typeof body.message === "string"
				? body.message
				: `Request failed with status ${response.status}`;
		throw new Error(message);
	}

	return response.json() as Promise<T>;
}

function isSessionUnavailableError(error: unknown) {
	if (!(error instanceof Error)) {
		return false;
	}
	const message = error.message.toLowerCase();
	return (
		message.includes("status 404") ||
		message.includes("status 500") ||
		message.includes("failed to fetch")
	);
}

export async function signUp(payload: AuthPayload): Promise<UserProfile> {
	const response = await fetch("/api/auth/register", createJsonRequestInit("POST", payload));
	return parseJsonResponse<UserProfile>(response);
}

export async function signIn(payload: SignInPayload): Promise<SessionResponse> {
	const response = await fetch("/api/auth/login", createJsonRequestInit("POST", payload));
	return parseJsonResponse<SessionResponse>(response);
}

export async function getSession(): Promise<SessionResponse> {
	let response: Response;

	try {
		response = await fetch("/api/auth/session", {
			cache: "no-store",
		});
	} catch (networkError) {
		if (isSessionUnavailableError(networkError)) {
			return { user: null };
		}
		throw networkError;
	}

	if (response.status === 404 || response.status === 500) {
		return { user: null };
	}

	return parseJsonResponse<SessionResponse>(response);
}

export async function signOut() {
	const response = await fetch("/api/auth/logout", {
		method: "POST",
	});
	return parseJsonResponse<{ success: boolean }>(response);
}

export async function signUpAdmin(payload: AuthPayload, jwt: string): Promise<UserProfile> {
	return apiProtectedJsonFetch<UserProfile>(
		"/admin/control/signup",
		jwt,
		createJsonRequestInit("POST", payload),
	);
}
