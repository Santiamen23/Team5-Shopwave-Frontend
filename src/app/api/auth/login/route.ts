import { NextResponse } from "next/server";

import type { SignInPayload } from "@/models/auth.model";
import { ApiError, createApiUrl, createBasicAuthHeader } from "@/services/api.service";
import {
	createSessionCookieOptions,
	getUserProfileFromToken,
	SESSION_COOKIE_NAME,
} from "@/lib/auth/session";

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

export async function POST(request: Request) {
	try {
		const payload = (await request.json()) as SignInPayload;

		const response = await fetch(createApiUrl("/auth/signin"), {
			method: "GET",
			cache: "no-store",
			headers: {
				Accept: "application/json",
				Authorization: createBasicAuthHeader(payload),
			},
		});
		const body = await readResponseBody(response);

		if (!response.ok) {
			throw new ApiError("/auth/signin", response.status, body);
		}

		const jwt = response.headers.get("Authorization");

		if (!jwt) {
			return NextResponse.json(
				{ message: "No se recibió el token de sesión." },
				{ status: 502 },
			);
		}

		const user = await getUserProfileFromToken(jwt);
		const nextResponse = NextResponse.json({ user });
		nextResponse.cookies.set(
			SESSION_COOKIE_NAME,
			jwt,
			createSessionCookieOptions(),
		);

		return nextResponse;
	} catch (error) {
		if (error instanceof ApiError) {
			return NextResponse.json(
				{ message: "Credenciales incorrectas." },
				{ status: error.status },
			);
		}

		return NextResponse.json(
			{ message: "No se pudo iniciar sesión." },
			{ status: 500 },
		);
	}
}
