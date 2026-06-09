export interface UserAddress {
	id?: number;
	firstName: string;
	lastName: string;
	streetAddress: string;
	city: string;
	state: string;
	zipCode: string;
	mobile: string;
}

export interface PaymentInformation {
	cardholderName?: string;
	cardNumber?: string;
	expirationDate?: string;
	cvv?: string;
}

export interface UserProfile {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	role: string;
	mobile: string;
	addresses: UserAddress[];
	paymentInformation: PaymentInformation[];
	createdAt: string | null;
}
