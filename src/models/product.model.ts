export interface ProductSize {
	name: string;
	quantity: number;
}

export interface ProductCategory {
	id?: number;
	name: string;
	level?: number;
	parentCategory?: ProductCategory | null;
}

export interface Product {
	id: number;
	title: string;
	description: string;
	price: number;
	discountedPrice: number;
	discountPersent: number;
	quantity: number;
	brand: string;
	color: string;
	sizes: ProductSize[];
	imageUrl: string;
	numRatings: number;
	category: ProductCategory | null;
	createdAt: string | null;
}

export interface ProductCardData {
	id: number;
	title: string;
	price: number;
	discountedPrice: number;
	discountPersent: number;
	imageUrl: string;
	brand: string;
	color: string;
	quantity: number;
}
