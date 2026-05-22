const DEFAULT_API_BASE_URL = "http://localhost:8080";

export function getApiBaseUrl() {
	return (
		process.env.NEXT_PUBLIC_API_BASE_URL ??
		process.env.NEXT_PUBLIC_API_URL ??
		DEFAULT_API_BASE_URL
	);
}

export function createApiUrl(path: string) {
	const normalizedBaseUrl = getApiBaseUrl().replace(/\/$/, "");
	const normalizedPath = path.startsWith("/") ? path : `/${path}`;
	return `${normalizedBaseUrl}${normalizedPath}`;
}

export async function apiFetch(path: string, init?: RequestInit) {
	return fetch(createApiUrl(path), {
		...init,
		headers: {
			Accept: "application/json",
			...(init?.headers ?? {}),
		},
	});
}
