import type { AuthPayload, SignInPayload, SignInResult } from "@/models/auth.model";
import type { UserProfile } from "@/models/user.model";

import {
	apiBasicAuthJsonFetch,
	apiJsonFetch,
	apiProtectedJsonFetch,
	createBearerToken,
	createJsonRequestInit,
} from "./api.service";

export async function signUp(payload: AuthPayload): Promise<UserProfile> {
	return apiJsonFetch<UserProfile>(
		"/auth/signup",
		createJsonRequestInit("POST", payload),
	);
}

export async function signIn(payload: SignInPayload): Promise<SignInResult> {
	const { data, response } = await apiBasicAuthJsonFetch<UserProfile>(
		"/auth/signin",
		payload,
		{
			cache: "no-store",
		},
	);
	const jwt = response.headers.get("Authorization");

	return {
		user: data,
		jwt,
		authorizationHeader: jwt ? createBearerToken(jwt) : null,
	};
}

export async function signUpAdmin(payload: AuthPayload, jwt: string): Promise<UserProfile> {
	return apiProtectedJsonFetch<UserProfile>(
		"/admin/control/signup",
		jwt,
		createJsonRequestInit("POST", payload),
	);
}
