import { NextResponse } from "next/server";

import type { AuthPayload } from "@/models/auth.model";
import { ApiError, createApiUrl } from "@/services/api.service";

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
		const payload = (await request.json()) as AuthPayload;

		const response = await fetch(createApiUrl("/auth/signup"), {
			method: "POST",
			cache: "no-store",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		});
		const body = await readResponseBody(response);

		if (!response.ok) {
			throw new ApiError("/auth/signup", response.status, body);
		}

		return NextResponse.json(body);
	} catch (error) {
		if (error instanceof ApiError) {
			return NextResponse.json(
				{ message: "No se pudo completar el registro." },
				{ status: error.status },
			);
		}

		console.error("[BFF /api/auth/register] Error al llamar al backend:", error);
		return NextResponse.json(
			{ message: "No se pudo completar el registro." },
			{ status: 500 },
		);
	}
}
