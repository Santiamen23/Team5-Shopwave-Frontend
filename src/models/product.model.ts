export interface ProductSize {
	name: string;
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

export interface CreateReviewPayload {
	productId: number;
	review: string;
}

export interface CreateRatingPayload {
	productId: number;
	rating: number;
}

export interface AdminCreateProductPayload {
	title: string;
	description: string;
	price: number;
	discountedPrice: number;
	discountPersent: number;
	quantity: number;
	brand: string;
	color: string;
	size: ProductSize[];
	imageUrl: string;
	topLevelCategory: string;
	secondLevelCategory: string;
	thirdLevelCategory: string;
}

export interface AdminUpdateProductPayload {
	id: number;
	title: string;
	description: string;
	price: number;
	discountedPrice: number;
	discountPersent: number;
	quantity: number;
	brand: string;
	color: string;
	imageUrl: string;
	topLevelCategory: string;
	secondLevelCategory: string;
	thirdLevelCategory: string;
}

export interface ProductQueryFilters {
	category?: string;
	colors?: string[];
	sizes?: string[];
	minPrice?: number;
	maxPrice?: number;
	minDiscount?: number;
	sort?: string;
	stock?: string;
	pageNumber?: number;
	pageSize?: number;
}
