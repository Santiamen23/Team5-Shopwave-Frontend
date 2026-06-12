const DEFAULT_API_BASE_URL = "http://localhost:8080";

export type ApiQueryValue =
	| string
	| number
	| boolean
	| null
	| undefined
	| Array<string | number | boolean>;

export type ApiQueryParams = Record<string, ApiQueryValue>;

export interface BasicAuthCredentials {
	email: string;
	password: string;
}

export class ApiError extends Error {
	status: number;
	path: string;
	body: unknown;

	constructor(path: string, status: number, body: unknown) {
		super(createApiErrorMessage(path, status, body));
		this.name = "ApiError";
		this.status = status;
		this.path = path;
		this.body = body;
	}
}

function createApiErrorMessage(path: string, status: number, body: unknown) {
	if (typeof body === "string" && body.trim().length > 0) {
		return `Request to ${path} failed with ${status}: ${body}`;
	}

	if (body && typeof body === "object" && "message" in body && typeof body.message === "string") {
		return `Request to ${path} failed with ${status}: ${body.message}`;
	}

	if (body && typeof body === "object" && "error" in body && typeof body.error === "string") {
		return `Request to ${path} failed with ${status}: ${body.error}`;
	}

	return `Request to ${path} failed with ${status}`;
}

function encodeBase64(value: string) {
	if (typeof btoa === "function") {
		return btoa(value);
	}

	return Buffer.from(value, "utf-8").toString("base64");
}

function createHeaders(
	initHeaders?: HeadersInit,
	extraHeaders?: Record<string, string | undefined>,
) {
	const headers = new Headers(initHeaders);
	headers.set("Accept", "application/json");

	for (const [key, value] of Object.entries(extraHeaders ?? {})) {
		if (value) {
			headers.set(key, value);
		}
	}

	return headers;
}

function createRequestBody(body: unknown) {
	return body === undefined ? undefined : JSON.stringify(body);
}

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

export function getApiBaseUrl() {
	return (
		process.env.NEXT_PUBLIC_API_BASE_URL ??
		process.env.NEXT_PUBLIC_API_URL ??
		DEFAULT_API_BASE_URL
	);
}

export function buildQueryString(query?: ApiQueryParams) {
	if (!query) {
		return "";
	}

	const searchParams = new URLSearchParams();

	for (const [key, value] of Object.entries(query)) {
		if (value === undefined || value === null) {
			continue;
		}

		if (Array.isArray(value)) {
			for (const item of value) {
				searchParams.append(key, String(item));
			}

			continue;
		}

		searchParams.append(key, String(value));
	}

	const queryString = searchParams.toString();
	return queryString ? `?${queryString}` : "";
}

export function createApiUrl(path: string, query?: ApiQueryParams) {
	const normalizedBaseUrl = getApiBaseUrl().replace(/\/$/, "");
	const normalizedPath = path.startsWith("/") ? path : `/${path}`;
	return `${normalizedBaseUrl}${normalizedPath}${buildQueryString(query)}`;
}

export function createBearerToken(jwt: string) {
	const normalizedToken = jwt.trim();
	return normalizedToken.toLowerCase().startsWith("bearer ")
		? normalizedToken
		: `Bearer ${normalizedToken}`;
}

export function createBasicAuthHeader({ email, password }: BasicAuthCredentials) {
	return `Basic ${encodeBase64(`${email}:${password}`)}`;
}

export async function apiFetch(path: string, init?: RequestInit, query?: ApiQueryParams) {
	return fetch(createApiUrl(path, query), {
		...init,
		headers: createHeaders(init?.headers),
	});
}

export async function apiJsonFetch<T>(
	path: string,
	init?: RequestInit,
	query?: ApiQueryParams,
): Promise<T> {
	const response = await apiFetch(path, init, query);
	const body = await readResponseBody(response);

	if (!response.ok) {
		throw new ApiError(path, response.status, body);
	}

	return body as T;
}

export async function apiProtectedFetch(
	path: string,
	jwt: string,
	init?: RequestInit,
	query?: ApiQueryParams,
) {
	return fetch(createApiUrl(path, query), {
		...init,
		headers: createHeaders(init?.headers, {
			Authorization: createBearerToken(jwt),
		}),
	});
}

export async function apiProtectedJsonFetch<T>(
	path: string,
	jwt: string,
	init?: RequestInit,
	query?: ApiQueryParams,
): Promise<T> {
	const response = await apiProtectedFetch(path, jwt, init, query);
	const body = await readResponseBody(response);

	if (!response.ok) {
		throw new ApiError(path, response.status, body);
	}

	return body as T;
}

export async function apiBasicAuthFetch(
	path: string,
	credentials: BasicAuthCredentials,
	init?: RequestInit,
	query?: ApiQueryParams,
) {
	return fetch(createApiUrl(path, query), {
		...init,
		headers: createHeaders(init?.headers, {
			Authorization: createBasicAuthHeader(credentials),
		}),
	});
}

export async function apiBasicAuthJsonFetch<T>(
	path: string,
	credentials: BasicAuthCredentials,
	init?: RequestInit,
	query?: ApiQueryParams,
): Promise<{ data: T; response: Response }> {
	const response = await apiBasicAuthFetch(path, credentials, init, query);
	const body = await readResponseBody(response);

	if (!response.ok) {
		throw new ApiError(path, response.status, body);
	}

	return {
		data: body as T,
		response,
	};
}

export function createJsonRequestInit(method: string, body?: unknown, init?: RequestInit): RequestInit {
	const headers = createHeaders(init?.headers, body === undefined ? undefined : { "Content-Type": "application/json" });

	return {
		...init,
		method,
		headers,
		body: body === undefined ? init?.body : createRequestBody(body),
	};
}
