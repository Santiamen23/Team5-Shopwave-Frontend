import type { Product } from "./product.model";
import type { UserProfile } from "./user.model";

export interface CartItem {
	id: number;
	product: Product;
	size: string;
	quantity: number;
	price: number | null;
	discountedPrice: number | null;
	userId: number | null;
}

export interface Cart {
	id: number;
	user?: UserProfile;
	cartItems: CartItem[];
	totalPrice: number;
	totalItem: number;
	totalDiscountedPrice: number;
	discounte: number;
}

export interface AddCartItemPayload {
	productId: number;
	size: string;
	quantity: number;
	price: number;
}

export type UpdateCartItemPayload = Partial<CartItem>;
