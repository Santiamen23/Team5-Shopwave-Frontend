import { NextResponse } from "next/server";

import { getApiBaseUrl } from "@/services/api.service";

export const dynamic = "force-dynamic";

export async function GET() {
	const apiBaseUrl = getApiBaseUrl();
	const explicitUrl =
		process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_URL ?? null;

	return NextResponse.json({
		nodeEnv: process.env.NODE_ENV ?? null,
		explicitEnvVar: explicitUrl,
		resolvedApiBaseUrl: apiBaseUrl,
		isUsingFallback: !explicitUrl,
		vercelEnv: process.env.VERCEL_ENV ?? null,
		vercelRegion: process.env.VERCEL_REGION ?? null,
	});
}
