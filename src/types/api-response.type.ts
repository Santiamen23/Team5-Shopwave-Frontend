export interface ApiResponse {
	message: string;
	status: boolean;
}

export interface PagedResponse<T> {
	content: T[];
	totalPages: number;
	totalElements: number;
	size: number;
	number: number;
	numberOfElements?: number;
	first: boolean;
	last: boolean;
	empty?: boolean;
	pageable?: unknown;
	sort?: unknown;
}
