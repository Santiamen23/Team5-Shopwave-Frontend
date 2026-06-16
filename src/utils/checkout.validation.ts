import type { CheckoutInput } from "@/context/CartContext";
import type { PaymentMethod } from "@/models/order.model";

import {
	isAddressValid,
	sanitizeAddress,
	validateAddress,
	type AddressFieldErrors,
	type SanitizedAddress,
} from "./address.validation";
import { validateRequired } from "./validation.util";

export type ShippingFieldErrors = AddressFieldErrors;
export type SanitizedShippingDetails = SanitizedAddress;

export interface PaymentFieldErrors {
	cardholderName?: string;
	cardNumber?: string;
}

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
	return validateAddress(shipping);
}

export function sanitizeShippingDetails(
	shipping: CheckoutInput["shipping"],
): SanitizedShippingDetails {
	return sanitizeAddress(shipping);
}

export function isShippingValid(shipping: CheckoutInput["shipping"]): boolean {
	return isAddressValid(shipping);
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
