export interface AuthPayload {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	mobile: string;
}

export interface SignInPayload {
	email: string;
	password: string;
}

export interface SignInResult {
	user: import("./user.model").UserProfile;
	jwt: string | null;
	authorizationHeader: string | null;
}
