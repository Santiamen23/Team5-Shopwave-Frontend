import type { CreateRatingPayload } from "@/models/product.model";
import type { Rating } from "@/models/rating.model";

import { apiJsonFetch, apiProtectedJsonFetch, createJsonRequestInit } from "./api.service";

export async function createRating(payload: CreateRatingPayload, jwt: string): Promise<Rating> {
	return apiProtectedJsonFetch<Rating>(
		"/ratings/create",
		jwt,
		createJsonRequestInit("POST", payload),
	);
}

export async function getProductRatings(productId: string | number): Promise<Rating[]> {
	return apiJsonFetch<Rating[]>(
		`/ratings/product/${productId}`,
		{
			cache: "no-store",
		},
	);
}
