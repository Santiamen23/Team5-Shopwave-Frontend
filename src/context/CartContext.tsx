"use client";

import { createContext, useCallback, useEffect, useRef, useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import type { Cart, CartItem } from "@/models/cart.model";
import type { Order } from "@/models/order.model";
import type { Product } from "@/models/product.model";
import type { UserProfile } from "@/models/user.model";
import {
	sanitizeShippingDetails,
	validateShippingDetails,
} from "@/utils/checkout.validation";

const EMPTY_CART: Cart = {
	id: 0,
	user: undefined,
	cartItems: [],
	totalPrice: 0,
	totalItem: 0,
	totalDiscountedPrice: 0,
	discounte: 0,
};

export interface AddToCartInput {
	product: Product;
	size: string;
	quantity: number;
}

export interface CheckoutShippingDetails {
	firstName: string;
	lastName: string;
	streetAddress: string;
	city: string;
	state: string;
	zipCode: string;
	mobile: string;
}

export interface CheckoutInput {
	shipping: CheckoutShippingDetails;
	addressId?: number;
	paymentMethod: import("@/models/order.model").PaymentMethod;
	cardholderName: string;
	cardNumber: string;
}

export interface CheckoutReceipt {
	orderNumber: string;
	totalItems: number;
	totalPrice: number;
	discountedTotal: number;
	discount: number;
}

interface CartContextValue {
	cart: Cart;
	isLoading: boolean;
	error: string | null;
	addItem: (input: AddToCartInput) => Promise<Cart>;
	updateQuantity: (cartItemId: number, quantity: number) => Promise<Cart>;
	removeItem: (cartItemId: number) => Promise<Cart>;
	clearCart: () => Promise<Cart>;
	checkout: (input: CheckoutInput) => Promise<CheckoutReceipt>;
	refreshCart: () => Promise<Cart>;
}

function ensureShippingDetails(shipping: CheckoutShippingDetails): CheckoutShippingDetails {
	const trimmed = sanitizeShippingDetails(shipping);

	if (Object.values(validateShippingDetails(trimmed)).some(Boolean)) {
		throw new Error("Faltan datos de envío. Revisa el formulario antes de continuar.");
	}

	return trimmed;
}

export const CartContext = createContext<CartContextValue | undefined>(undefined);

function cloneCart(cart: Cart): Cart {
	return {
		...cart,
		cartItems: [...cart.cartItems],
	};
}

function normalizeItem(item: CartItem): CartItem {
	return {
		...item,
		price: item.price ?? item.product.price * item.quantity,
		discountedPrice: item.discountedPrice ?? item.product.discountedPrice * item.quantity,
	};
}

function calculateCart(cartItems: CartItem[], user?: UserProfile | null, id = 0): Cart {
	const normalizedItems = cartItems.map(normalizeItem);
	const totalPrice = normalizedItems.reduce((sum, item) => sum + (item.price ?? 0), 0);
	const totalDiscountedPrice = normalizedItems.reduce((sum, item) => sum + (item.discountedPrice ?? 0), 0);
	const totalItem = normalizedItems.reduce((sum, item) => sum + item.quantity, 0);

	return {
		id,
		user: user ?? undefined,
		cartItems: normalizedItems,
		totalPrice,
		totalItem,
		totalDiscountedPrice,
		discounte: Math.max(totalPrice - totalDiscountedPrice, 0),
	};
}

function normalizeCart(cart: Cart | null | undefined): Cart {
	if (!cart) {
		return cloneCart(EMPTY_CART);
	}

	return {
		...EMPTY_CART,
		...cart,
		cartItems: Array.isArray(cart.cartItems) ? cart.cartItems.map(normalizeItem) : [],
	};
}

function hasCartItems(cart: Cart | null | undefined) {
	return Array.isArray(cart?.cartItems) && cart.cartItems.length > 0;
}

function isIgnorableSyncError(error: unknown) {
	if (!(error instanceof Error)) return false;
	const message = error.message.toLowerCase();
	return (
		message.includes("status 400") ||
		message.includes("status 404") ||
		message.includes("status 500")
	);
}

function isCartItemMissingError(error: unknown) {
	if (!(error instanceof Error)) return false;
	const message = error.message.toLowerCase();
	return (
		message.includes("status 404") ||
		message.includes("cart item") ||
		message.includes("not found")
	);
}

function isCartNotInitializedError(error: unknown) {
	if (!(error instanceof Error)) {
		return false;
	}
	const message = error.message.toLowerCase();
	return message.includes("cart") && message.includes("null");
}

function describeCartError(error: unknown): string {
	if (isCartNotInitializedError(error)) {
		return "El servidor todavía no tiene un carrito creado para tu cuenta. Vuelve a iniciar sesión o contacta al equipo de backend para que el endpoint cree el carrito automáticamente al primer uso.";
	}
	return error instanceof Error ? error.message : "No se pudo sincronizar el carrito con el servidor.";
}

function isServerCartItem(item: CartItem) {
	return item.userId !== null;
}

function getItemQuantity(product: Product) {
	return product.quantity ?? 0;
}

function createCartItemFromProduct(product: Product, size: string, quantity: number): CartItem {
	const safeQuantity = Math.max(quantity, 1);

	return {
		id: Date.now(),
		product,
		size,
		quantity: safeQuantity,
		price: product.price * safeQuantity,
		discountedPrice: product.discountedPrice * safeQuantity,
		userId: null,
	};
}

function mergeItem(cart: Cart, item: CartItem): Cart {
	const existingIndex = cart.cartItems.findIndex(
		(currentItem) => currentItem.product.id === item.product.id && currentItem.size === item.size,
	);

	if (existingIndex === -1) {
		return calculateCart([...cart.cartItems, normalizeItem(item)], cart.user ?? null, cart.id);
	}

	const existingItem = cart.cartItems[existingIndex];
	const mergedQuantity = existingItem.quantity + item.quantity;
	const mergedItem: CartItem = {
		...existingItem,
		quantity: mergedQuantity,
		price: existingItem.product.price * mergedQuantity,
		discountedPrice: existingItem.product.discountedPrice * mergedQuantity,
	};

	const nextItems = [...cart.cartItems];
	nextItems[existingIndex] = mergedItem;
	return calculateCart(nextItems, cart.user ?? null, cart.id);
}

function updateQuantityLocal(cart: Cart, cartItemId: number, quantity: number): Cart {
	if (quantity <= 0) {
		return removeLocalItem(cart, cartItemId);
	}

	return calculateCart(
		cart.cartItems.map((item) =>
			item.id === cartItemId
				? {
					...item,
					quantity,
					price: item.product.price * quantity,
					discountedPrice: item.product.discountedPrice * quantity,
				}
				: item,
		),
		cart.user ?? null,
		cart.id,
	);
}

function removeLocalItem(cart: Cart, cartItemId: number): Cart {
	return calculateCart(
		cart.cartItems.filter((item) => item.id !== cartItemId),
		cart.user ?? null,
		cart.id,
	);
}

async function requestJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
	const response = await fetch(input, {
		...init,
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			...(init?.headers ?? {}),
		},
	});

	const responseText = await response.text();
	const responseBody = responseText ? (JSON.parse(responseText) as unknown) : null;

	if (!response.ok) {
		const message =
			responseBody && typeof responseBody === "object" && "message" in responseBody &&
			typeof (responseBody as { message?: unknown }).message === "string"
				? (responseBody as { message: string }).message
				: `Request failed with status ${response.status}`;

		throw new Error(message);
	}

	return responseBody as T;
}

async function loadRemoteCart() {
	return requestJson<Cart>("/api/cart", { cache: "no-store" });
}

async function addRemoteItem(input: AddToCartInput) {
	return requestJson<Cart>("/api/cart/add", {
		method: "POST",
		body: JSON.stringify({
			productId: input.product.id,
			size: input.size,
			quantity: input.quantity,
			price: input.product.discountedPrice,
		}),
	});
}

async function updateRemoteItem(cartItem: CartItem) {
	return requestJson<Cart>(`/api/cart/items/${cartItem.id}`, {
		method: "PUT",
		body: JSON.stringify(cartItem),
	});
}

async function removeRemoteItem(cartItemId: number) {
	return requestJson<Cart>(`/api/cart/items/${cartItemId}`, {
		method: "DELETE",
	});
}

export function CartProvider({ children }: { children: React.ReactNode }) {
	const { isAuthenticated, isLoading: isAuthLoading, user } = useAuth();
	const [cart, setCart] = useState<Cart>(() => cloneCart(EMPTY_CART));
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const operationInProgressRef = useRef(0);

	function beginOperation() {
		operationInProgressRef.current += 1;
	}

	function endOperation() {
		operationInProgressRef.current = Math.max(0, operationInProgressRef.current - 1);
	}

	function hasPendingOperation() {
		return operationInProgressRef.current > 0;
	}

	const commitCart = useCallback((nextCart: Cart, nextUser?: UserProfile | null) => {
		const normalizedCart = normalizeCart(nextCart);
		const resolvedCart = {
			...normalizedCart,
			user: nextUser ?? user ?? normalizedCart.user,
		};
		setCart(resolvedCart);
		return resolvedCart;
	}, [user]);

	const prevAuthRef = useRef<boolean | null>(null);

	useEffect(() => {
		if (isAuthLoading) {
			return;
		}

		const previousAuth = prevAuthRef.current;
		const authStateChanged = previousAuth !== isAuthenticated;

		if (!authStateChanged) {
			return;
		}

		if (hasPendingOperation()) {
			return;
		}

		prevAuthRef.current = isAuthenticated;

		let cancelled = false;

		async function hydrateCart() {
			setIsLoading(true);
			setError(null);

			try {
				if (!isAuthenticated) {
					if (!cancelled) {
						setCart(cloneCart(EMPTY_CART));
					}

					return;
				}

				const remoteCart = await loadRemoteCart().catch(() => null);

				if (!cancelled) {
					commitCart(remoteCart ? normalizeCart(remoteCart) : cloneCart(EMPTY_CART), user);
				}
			} catch (loadError) {
				if (!cancelled) {
					setCart(cloneCart(EMPTY_CART));
					setError(loadError instanceof Error ? loadError.message : "No se pudo cargar el carrito.");
				}
			} finally {
				if (!cancelled) {
					setIsLoading(false);
				}
			}
		}

		void hydrateCart();

		return () => {
			cancelled = true;
		};
	}, [commitCart, isAuthLoading, isAuthenticated, user]);

	async function refreshCart() {
		if (!isAuthenticated) {
			setCart(cloneCart(EMPTY_CART));
			return cloneCart(EMPTY_CART);
		}

		const remoteCart = normalizeCart(await loadRemoteCart());
		return commitCart(remoteCart, user);
	}

	async function addItem(input: AddToCartInput) {
		beginOperation();
		try {
			if (!input.size) {
				throw new Error("Selecciona una variante antes de agregar el producto.");
			}

			const availableQuantity = getItemQuantity(input.product);

			if (input.quantity < 1) {
				throw new Error("La cantidad debe ser mayor a cero.");
			}

			if (availableQuantity > 0 && input.quantity > availableQuantity) {
				throw new Error("La cantidad solicitada supera el stock disponible.");
			}

			const optimisticItem = createCartItemFromProduct(input.product, input.size, input.quantity);
			const optimisticCart = mergeItem(cart, optimisticItem);
			commitCart(optimisticCart, user);

			if (isAuthenticated) {
				try {
					await loadRemoteCart().catch(() => null);
					await addRemoteItem(input);
					const hydratedCart = await loadRemoteCart().catch(() => null);
					if (hydratedCart && hasCartItems(hydratedCart)) {
						return commitCart(hydratedCart, user);
					}
				} catch (remoteError) {
					if (!isIgnorableSyncError(remoteError)) {
						setError(describeCartError(remoteError));
					}
				}

				return optimisticCart;
			}

			return optimisticCart;
		} finally {
			endOperation();
		}
	}

	async function updateQuantity(cartItemId: number, quantity: number) {
		beginOperation();
		try {
			const currentItem = cart.cartItems.find((item) => item.id === cartItemId);

			if (!currentItem) {
				throw new Error("El producto no está en el carrito.");
			}

			if (quantity <= 0) {
				return removeItem(cartItemId);
			}

			const availableQuantity = getItemQuantity(currentItem.product);

			if (availableQuantity > 0 && quantity > availableQuantity) {
				throw new Error("La cantidad solicitada supera el stock disponible.");
			}

			const optimisticCart = updateQuantityLocal(cart, cartItemId, quantity);
			commitCart(optimisticCart, user);

			if (isAuthenticated && isServerCartItem(currentItem)) {
				try {
					const remoteCart = await updateRemoteItem({
						...currentItem,
						quantity,
						price: currentItem.product.price * quantity,
						discountedPrice: currentItem.product.discountedPrice * quantity,
					});
					if (hasCartItems(remoteCart) || optimisticCart.cartItems.length === 0) {
						return commitCart(remoteCart, user);
					}
				} catch (remoteError) {
					if (!isIgnorableSyncError(remoteError)) {
						setError(remoteError instanceof Error ? remoteError.message : "No se pudo sincronizar el carrito.");
					}
				}

				return optimisticCart;
			}

			return optimisticCart;
		} finally {
			endOperation();
		}
	}

	async function removeItem(cartItemId: number) {
		beginOperation();
		try {
			const optimisticCart = removeLocalItem(cart, cartItemId);
			commitCart(optimisticCart, user);

			const currentItem = cart.cartItems.find((item) => item.id === cartItemId);

			if (isAuthenticated && currentItem && isServerCartItem(currentItem)) {
				try {
					const remoteCart = await removeRemoteItem(cartItemId);
					return commitCart(remoteCart, user);
				} catch (remoteError) {
					if (isCartItemMissingError(remoteError)) {
						return commitCart(optimisticCart, user);
					}
					if (!isIgnorableSyncError(remoteError)) {
						setError(remoteError instanceof Error ? remoteError.message : "No se pudo sincronizar el carrito.");
					}
				}

				return optimisticCart;
			}

			return optimisticCart;
		} finally {
			endOperation();
		}
	}

	async function clearCart() {
		beginOperation();
		try {
			const emptyCart = cloneCart(EMPTY_CART);

			setCart(emptyCart);
			setError(null);

			const itemsToRemove = cart.cartItems.filter((item) =>
				isAuthenticated ? isServerCartItem(item) : false,
			);

			if (isAuthenticated && itemsToRemove.length > 0) {
				await Promise.all(
					itemsToRemove.map((item) =>
						removeRemoteItem(item.id).catch((remoteError) => {
							if (!isCartItemMissingError(remoteError)) {
								console.warn("No se pudo eliminar el item del servidor:", remoteError);
							}
						}),
					),
				);
			}

			return emptyCart;
		} finally {
			endOperation();
		}
	}

	async function checkout(input: CheckoutInput) {
		if (!cart.cartItems.length) {
			throw new Error("El carrito está vacío.");
		}

		if (!user) {
			throw new Error("Debes iniciar sesión para finalizar la compra.");
		}

		const shipping = ensureShippingDetails(input.shipping);

		const cardholderName = (input.cardholderName || `${shipping.firstName} ${shipping.lastName}`).trim();

		const order = await requestJson<Order>("/api/orders", {
			method: "POST",
			body: JSON.stringify({
				...(input.addressId ? { addressId: input.addressId } : {}),
				firstName: shipping.firstName,
				lastName: shipping.lastName,
				streetAddress: shipping.streetAddress,
				city: shipping.city,
				state: shipping.state,
				zipCode: shipping.zipCode,
				mobile: shipping.mobile,
				paymentMethod: input.paymentMethod,
				status: "COMPLETED",
				paymentId: `SW-${Date.now()}`,
				cardholderName,
				cardNumber: input.cardNumber,
			}),
		});

		const emptyCart = cloneCart(EMPTY_CART);
		setCart(emptyCart);

		return {
			orderNumber: order.orderId || String(order.id),
			totalItems: order.totalItem,
			totalPrice: order.totalPrice,
			discountedTotal: order.totalDiscountedPrice ?? order.totalPrice,
			discount: order.discounte ?? 0,
		};
	}

	return (
		<CartContext.Provider
			value={{
				cart,
				isLoading,
				error,
				addItem,
				updateQuantity,
				removeItem,
				clearCart,
				checkout,
				refreshCart,
			}}
		>
			{children}
		</CartContext.Provider>
	);
}
