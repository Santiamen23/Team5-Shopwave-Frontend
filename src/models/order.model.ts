import type { Product } from "./product.model";
import type { UserAddress, UserProfile } from "./user.model";

export type PaymentMethod =
	| "CREDIT_CARD"
	| "DEBIT_CARD"
	| "NET_BANKING"
	| "UPI"
	| "PAYPAL"
	| "GOOGLE_PAY";

export type PaymentStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

export type OrderStatus =
	| "PENDING"
	| "PLACED"
	| "CONFIRMED"
	| "SHIPPED"
	| "DELIVERED"
	| "CANCELLED";

export interface PaymentDetails {
	paymentMethod?: PaymentMethod;
	status?: PaymentStatus;
	paymentId?: string;
	cardholderName?: string;
	cardNumber?: string;
	expirationDate?: string;
	cvv?: string;
}

export interface OrderItem {
	id: number;
	product: Product;
	size: string;
	quantity: number;
	price: number | null;
	discountedPrice: number | null;
	userId: number | null;
	deliveryDate: string | null;
}

export interface Order {
	id: number;
	orderId: string;
	user?: UserProfile;
	orderItems: OrderItem[];
	orderDate: string | null;
	deliveryDate: string | null;
	shippingAddress: UserAddress | null;
	paymentDetails: PaymentDetails;
	totalPrice: number;
	totalDiscountedPrice: number | null;
	discounte: number | null;
	orderStatus: OrderStatus;
	totalItem: number;
	createdAt: string | null;
}

export interface CreateOrderPayload {
	addressId?: number;
	firstName: string;
	lastName: string;
	streetAddress: string;
	city: string;
	state: string;
	zipCode: string;
	mobile: string;
	paymentMethod: PaymentMethod;
	status: PaymentStatus;
	paymentId: string;
	cardholderName: string;
	cardNumber: string;
}
