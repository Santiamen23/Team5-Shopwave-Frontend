import type { UserAddress } from "@/models/user.model";

import { validateRequired } from "./validation.util";

export interface AddressFieldErrors {
	firstName?: string;
	lastName?: string;
	streetAddress?: string;
	city?: string;
	state?: string;
	zipCode?: string;
	mobile?: string;
}

export interface SanitizedAddress {
	firstName: string;
	lastName: string;
	streetAddress: string;
	city: string;
	state: string;
	zipCode: string;
	mobile: string;
}

const ZIP_REGEX = /^[\w\s-]{3,10}$/;
const MOBILE_REGEX = /^\+?[\d\s-]{7,15}$/;

export function validateAddress(address: Partial<UserAddress>): AddressFieldErrors {
	const errors: AddressFieldErrors = {};

	if (validateRequired(address.firstName)) errors.firstName = "Ingresa tu nombre.";
	if (validateRequired(address.lastName)) errors.lastName = "Ingresa tu apellido.";
	if (validateRequired(address.streetAddress))
		errors.streetAddress = "La dirección es obligatoria.";
	if (validateRequired(address.city)) errors.city = "Ingresa la ciudad.";
	if (validateRequired(address.state))
		errors.state = "Ingresa el estado o departamento.";

	if (validateRequired(address.zipCode)) {
		errors.zipCode = "Ingresa el código postal.";
	} else if (!ZIP_REGEX.test(address.zipCode!.trim())) {
		errors.zipCode = "Código postal inválido.";
	}

	if (validateRequired(address.mobile)) {
		errors.mobile = "Ingresa un celular de contacto.";
	} else if (!MOBILE_REGEX.test(address.mobile!.trim())) {
		errors.mobile = "Número de celular inválido.";
	}

	return errors;
}

export function sanitizeAddress(address: Partial<UserAddress>): SanitizedAddress {
	return {
		firstName: (address.firstName ?? "").trim(),
		lastName: (address.lastName ?? "").trim(),
		streetAddress: (address.streetAddress ?? "").trim(),
		city: (address.city ?? "").trim(),
		state: (address.state ?? "").trim(),
		zipCode: (address.zipCode ?? "").trim(),
		mobile: (address.mobile ?? "").trim(),
	};
}

export function isAddressValid(address: Partial<UserAddress>): boolean {
	return Object.values(validateAddress(address)).every((value) => !value);
}
