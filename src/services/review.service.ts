import type { CreateReviewPayload } from "@/models/product.model";
import type { Review } from "@/models/review.model";

import { apiJsonFetch, apiProtectedJsonFetch, createJsonRequestInit } from "./api.service";

export async function createReview(payload: CreateReviewPayload, jwt: string): Promise<Review> {
	return apiProtectedJsonFetch<Review>(
		"/reviews/create",
		jwt,
		createJsonRequestInit("POST", payload),
	);
}

export async function getProductReviews(productId: string | number): Promise<Review[]> {
	return apiJsonFetch<Review[]>(
		`/reviews/product/${productId}`,
		{
			cache: "no-store",
		},
	);
}
