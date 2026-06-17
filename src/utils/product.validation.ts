import type { AdminCreateProductPayload, Product, ProductSize } from "@/models/product.model";

import {
	validateMinLength,
	validateNumber,
	validateProductVariants,
	validateRequired,
	validateUrl,
} from "./validation.util";

export interface ProductFieldErrors {
	title?: string;
	description?: string;
	price?: string;
	discountedPrice?: string;
	discountPersent?: string;
	quantity?: string;
	brand?: string;
	color?: string;
	imageUrl?: string;
	topLevelCategory?: string;
	secondLevelCategory?: string;
	thirdLevelCategory?: string;
	variants?: string;
}

export function validateCreateProduct(
	data: AdminCreateProductPayload,
): ProductFieldErrors {
	const errors: ProductFieldErrors = {};

	const titleError = validateMinLength(data.title, 3, "El nombre");
	if (titleError) errors.title = titleError;

	const descriptionError = validateMinLength(data.description, 10, "La descripción");
	if (descriptionError) errors.description = descriptionError;

	const priceError = validateNumber(data.price, "El precio", { min: 0.01 });
	if (priceError) {
		errors.price = priceError;
	} else if (data.discountedPrice > data.price) {
		errors.price = "El precio original no puede ser menor al precio con descuento.";
	}

	const discountedError = validateNumber(
		data.discountedPrice,
		"El precio con descuento",
		{ min: 0 },
	);
	if (discountedError) {
		errors.discountedPrice = discountedError;
	} else if (data.discountedPrice > data.price) {
		errors.discountedPrice =
			"El precio con descuento no puede ser mayor al precio original.";
	}

	const discountError = validateNumber(data.discountPersent, "El descuento", {
		min: 0,
		max: 100,
	});
	if (discountError) errors.discountPersent = discountError;

	const quantityError = validateNumber(data.quantity, "La cantidad total", {
		min: 1,
	});
	if (quantityError) errors.quantity = quantityError;

	const brandError = validateRequired(data.brand);
	if (brandError) errors.brand = "La marca es obligatoria.";

	const colorError = validateRequired(data.color);
	if (colorError) errors.color = "El color es obligatorio.";

	const imageError = validateUrl(data.imageUrl);
	if (imageError) errors.imageUrl = imageError;

	const topError = validateRequired(data.topLevelCategory);
	if (topError) errors.topLevelCategory = "La categoría principal es obligatoria.";

	const secondError = validateRequired(data.secondLevelCategory);
	if (secondError) errors.secondLevelCategory = "La categoría secundaria es obligatoria.";

	const thirdError = validateRequired(data.thirdLevelCategory);
	if (thirdError) errors.thirdLevelCategory = "La categoría terciaria es obligatoria.";

	const variantsError = validateProductVariants(data.size);
	if (variantsError) errors.variants = variantsError ?? "Debes agregar al menos una variante.";

	return errors;
}

export interface EditProductFieldErrors extends ProductFieldErrors {
	variants?: string;
}

export function validateEditProduct(product: Product): EditProductFieldErrors {
	const errors: EditProductFieldErrors = {};

	const titleError = validateRequired(product.title);
	if (titleError) errors.title = "El nombre es obligatorio.";

	const descriptionError = validateRequired(product.description);
	if (descriptionError) errors.description = "La descripción es obligatoria.";

	const priceError = validateNumber(product.price, "El precio", { min: 0.01 });
	if (priceError) errors.price = priceError;

	const discountedError = validateNumber(
		product.discountedPrice,
		"El precio con descuento",
		{ min: 0 },
	);
	if (discountedError) {
		errors.discountedPrice = discountedError;
	} else if (product.discountedPrice > product.price) {
		errors.discountedPrice =
			"El precio con descuento no puede ser mayor al precio original.";
	}

	const discountError = validateNumber(product.discountPersent, "El descuento", {
		min: 0,
		max: 100,
	});
	if (discountError) errors.discountPersent = discountError;

	const quantityError = validateNumber(product.quantity, "La cantidad", {
		min: 0,
	});
	if (quantityError) errors.quantity = quantityError;

	const brandError = validateRequired(product.brand);
	if (brandError) errors.brand = "La marca es obligatoria.";

	const colorError = validateRequired(product.color);
	if (colorError) errors.color = "El color es obligatorio.";

	const imageError = validateUrl(product.imageUrl);
	if (imageError) errors.imageUrl = imageError;

	return errors;
}

export function sanitizeCreateVariants(
	sizes: ProductSize[],
): ProductSize[] {
	return sizes
		.map((size) => ({ name: size.name.trim() }))
		.filter((size) => size.name.length > 0);
}
