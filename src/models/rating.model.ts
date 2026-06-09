import type { Product } from "./product.model";
import type { UserProfile } from "./user.model";

export interface Rating {
	id: number;
	user?: UserProfile;
	product?: Product;
	rating: number;
	createdAt: string | null;
}
