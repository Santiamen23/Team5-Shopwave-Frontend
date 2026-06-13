export type FieldErrors = Record<string, string | undefined>;

export const REQUIRED_ERROR = "Este campo es obligatorio.";

export function validateRequired(value: unknown): string | null {
	if (value === undefined || value === null) {
		return REQUIRED_ERROR;
	}

	if (typeof value === "string" && value.trim() === "") {
		return REQUIRED_ERROR;
	}

	if (typeof value === "number" && Number.isNaN(value)) {
		return REQUIRED_ERROR;
	}

	return null;
}

export function validateEmail(value: string): string | null {
	const required = validateRequired(value);
	if (required) {
		return "El correo electrónico es obligatorio.";
	}

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(value.trim())
		? null
		: "Ingresa un correo electrónico válido.";
}

export function validateMinLength(value: string, min: number, fieldLabel: string): string | null {
	const required = validateRequired(value);
	if (required) {
		return `${fieldLabel} es obligatorio.`;
	}

	return value.trim().length >= min
		? null
		: `${fieldLabel} debe tener al menos ${min} caracteres.`;
}

export function validateNumber(value: number, fieldLabel: string, options: { min?: number; max?: number } = {}): string | null {
	if (Number.isNaN(value) || !Number.isFinite(value)) {
		return `${fieldLabel} debe ser un número válido.`;
	}

	const { min, max } = options;

	if (min !== undefined && value < min) {
		return `${fieldLabel} debe ser mayor o igual a ${min}.`;
	}

	if (max !== undefined && value > max) {
		return `${fieldLabel} debe ser menor o igual a ${max}.`;
	}

	return null;
}

export function validateUrl(value: string): string | null {
	const required = validateRequired(value);
	if (required) {
		return "La URL de la imagen es obligatoria.";
	}

	try {
		const parsed = new URL(value.trim());
		return parsed.protocol === "http:" || parsed.protocol === "https:"
			? null
			: "La URL debe comenzar con http:// o https://";
	} catch {
		return "Ingresa una URL válida.";
	}
}

export function getInputBorderClass(hasError: unknown): string {
	return hasError
		? "border-danger-500 focus:border-danger-500 focus:ring-danger-500/30"
		: "border-slate-200 focus:border-brand-500 focus:ring-brand-500/20";
}
