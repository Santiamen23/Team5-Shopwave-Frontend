import type { CheckoutInput } from "@/context/CartContext";
import type { PaymentMethod } from "@/models/order.model";

import { validateRequired } from "./validation.util";

export interface ShippingFieldErrors {
	firstName?: string;
	lastName?: string;
	streetAddress?: string;
	city?: string;
	state?: string;
	zipCode?: string;
	mobile?: string;
}

export interface SanitizedShippingDetails {
	firstName: string;
	lastName: string;
	streetAddress: string;
	city: string;
	state: string;
	zipCode: string;
	mobile: string;
}

export interface PaymentFieldErrors {
	cardholderName?: string;
	cardNumber?: string;
}

const ZIP_REGEX = /^[\w\s-]{3,10}$/;
const MOBILE_REGEX = /^\+?[\d\s-]{7,15}$/;
const CARD_REGEX = /^\d{13,19}$/;

export function validateCardNumber(value: string): string | null {
	const required = validateRequired(value);
	if (required) {
		return "El número de tarjeta es obligatorio.";
	}

	const digits = value.replace(/\s+/g, "");
	return CARD_REGEX.test(digits)
		? null
		: "Número de tarjeta inválido (13 a 19 dígitos).";
}

export function validateShippingDetails(
	shipping: CheckoutInput["shipping"],
): ShippingFieldErrors {
	const errors: ShippingFieldErrors = {};

	if (validateRequired(shipping.firstName)) errors.firstName = "Ingresa tu nombre.";
	if (validateRequired(shipping.lastName)) errors.lastName = "Ingresa tu apellido.";
	if (validateRequired(shipping.streetAddress))
		errors.streetAddress = "La dirección es obligatoria.";
	if (validateRequired(shipping.city)) errors.city = "Ingresa la ciudad.";
	if (validateRequired(shipping.state))
		errors.state = "Ingresa el estado o departamento.";

	if (validateRequired(shipping.zipCode)) {
		errors.zipCode = "Ingresa el código postal.";
	} else if (!ZIP_REGEX.test(shipping.zipCode.trim())) {
		errors.zipCode = "Código postal inválido.";
	}

	if (validateRequired(shipping.mobile)) {
		errors.mobile = "Ingresa un celular de contacto.";
	} else if (!MOBILE_REGEX.test(shipping.mobile.trim())) {
		errors.mobile = "Número de celular inválido.";
	}

	return errors;
}

export function sanitizeShippingDetails(
	shipping: CheckoutInput["shipping"],
): SanitizedShippingDetails {
	return {
		firstName: shipping.firstName.trim(),
		lastName: shipping.lastName.trim(),
		streetAddress: shipping.streetAddress.trim(),
		city: shipping.city.trim(),
		state: shipping.state.trim(),
		zipCode: shipping.zipCode.trim(),
		mobile: shipping.mobile.trim(),
	};
}

export function validatePaymentDetails(
	method: PaymentMethod,
	cardholderName: string,
	cardNumber: string,
): PaymentFieldErrors {
	const errors: PaymentFieldErrors = {};

	if (method !== "CREDIT_CARD" && method !== "DEBIT_CARD") {
		return errors;
	}

	if (validateRequired(cardholderName)) {
		errors.cardholderName = "Ingresa el titular de la tarjeta.";
	}

	const cardError = validateCardNumber(cardNumber);
	if (cardError) errors.cardNumber = cardError;

	return errors;
}
