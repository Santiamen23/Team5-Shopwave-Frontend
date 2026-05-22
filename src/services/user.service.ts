import type { UserProfile } from "@/models/user.model";

import { apiProtectedJsonFetch } from "./api.service";

export async function getUserProfile(jwt: string): Promise<UserProfile> {
	return apiProtectedJsonFetch<UserProfile>(
		"/users/profile",
		jwt,
		{
			cache: "no-store",
		},
	);
}
