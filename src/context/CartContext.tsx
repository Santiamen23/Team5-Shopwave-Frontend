"use client";

import { createContext, useCallback, useEffect, useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import type { Cart, CartItem } from "@/models/cart.model";
import type { Order } from "@/models/order.model";
import type { Product } from "@/models/product.model";
import type { UserProfile } from "@/models/user.model";

const STORAGE_KEY = "shopwave_cart_v1";

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
	checkout: () => Promise<CheckoutReceipt>;
	refreshCart: () => Promise<Cart>;
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
	return error instanceof Error && error.message.includes("status 400");
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

function readStoredCart(): Cart | null {
	if (typeof window === "undefined") {
		return null;
	}

	const rawCart = window.localStorage.getItem(STORAGE_KEY);

	if (!rawCart) {
		return null;
	}

	try {
		return normalizeCart(JSON.parse(rawCart) as Cart);
	} catch {
		window.localStorage.removeItem(STORAGE_KEY);
		return null;
	}
}

function persistCart(cart: Cart) {
	if (typeof window === "undefined") {
		return;
	}

	window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

function clearStoredCart() {
	if (typeof window === "undefined") {
		return;
	}

	window.localStorage.removeItem(STORAGE_KEY);
}

function getItemQuantity(product: Product, size: string) {
	const sizeEntry = product.sizes?.find((item) => item.name === size);
	return sizeEntry?.quantity ?? product.quantity;
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

	const commitCart = useCallback((nextCart: Cart, nextUser?: UserProfile | null) => {
		const normalizedCart = normalizeCart(nextCart);
		const resolvedCart = {
			...normalizedCart,
			user: nextUser ?? user ?? normalizedCart.user,
		};
		setCart(resolvedCart);
		persistCart(resolvedCart);
		return resolvedCart;
	}, [user]);

	useEffect(() => {
		if (isAuthLoading) {
			return;
		}

		let cancelled = false;

		async function hydrateCart() {
			setIsLoading(true);
			setError(null);

			try {
				const storedCart = readStoredCart();

				if (!isAuthenticated) {
					if (!cancelled) {
						setCart(storedCart ? normalizeCart(storedCart) : cloneCart(EMPTY_CART));
					}

					return;
				}

				const remoteCart = await loadRemoteCart().catch(() => null);
				let nextCart = remoteCart ? normalizeCart(remoteCart) : storedCart ? normalizeCart(storedCart) : cloneCart(EMPTY_CART);

				if (storedCart?.cartItems.length) {
					await loadRemoteCart().catch(() => null);
					for (const item of storedCart.cartItems) {
						try {
							nextCart = await addRemoteItem({
								product: item.product,
								size: item.size,
								quantity: item.quantity,
							});
						} catch (syncError) {
							if (isCartNotInitializedError(syncError)) {
								await loadRemoteCart().catch(() => null);
								nextCart = await addRemoteItem({
									product: item.product,
									size: item.size,
									quantity: item.quantity,
								});
							} else {
								throw syncError;
							}
						}
					}
				}

				const hydratedCart = await loadRemoteCart().catch(() => nextCart);

				if (!cancelled) {
					const preferredCart = hasCartItems(hydratedCart) ? hydratedCart : nextCart;
					commitCart(preferredCart, user);
				}
			} catch (loadError) {
				const storedCart = readStoredCart();

				if (!cancelled) {
					setCart(storedCart ? normalizeCart(storedCart) : cloneCart(EMPTY_CART));
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

	useEffect(() => {
		if (!isAuthLoading && !isAuthenticated) {
			persistCart(cart);
		}
	}, [cart, isAuthLoading, isAuthenticated]);

	async function refreshCart() {
		if (!isAuthenticated) {
			const storedCart = readStoredCart();
			const nextCart = storedCart ? normalizeCart(storedCart) : cloneCart(EMPTY_CART);
			setCart(nextCart);
			return nextCart;
		}

		const remoteCart = normalizeCart(await loadRemoteCart());
		return commitCart(remoteCart, user);
	}

	async function addItem(input: AddToCartInput) {
		if (!input.size) {
			throw new Error("Selecciona un talle antes de agregar el producto.");
		}

		const availableQuantity = getItemQuantity(input.product, input.size);

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
	}

	async function updateQuantity(cartItemId: number, quantity: number) {
		const currentItem = cart.cartItems.find((item) => item.id === cartItemId);

		if (!currentItem) {
			throw new Error("El producto no está en el carrito.");
		}

		if (quantity <= 0) {
			return removeItem(cartItemId);
		}

		const availableQuantity = getItemQuantity(currentItem.product, currentItem.size);

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
	}

	async function removeItem(cartItemId: number) {
		const optimisticCart = removeLocalItem(cart, cartItemId);
		commitCart(optimisticCart, user);

		const currentItem = cart.cartItems.find((item) => item.id === cartItemId);

		if (isAuthenticated && currentItem && isServerCartItem(currentItem)) {
			try {
				const remoteCart = await removeRemoteItem(cartItemId);
				return commitCart(remoteCart, user);
			} catch (remoteError) {
				if (!isIgnorableSyncError(remoteError)) {
					setError(remoteError instanceof Error ? remoteError.message : "No se pudo sincronizar el carrito.");
				}
			}

			return optimisticCart;
		}

		return optimisticCart;
	}

	async function clearCart() {
		if (isAuthenticated) {
			for (const item of cart.cartItems) {
				if (isServerCartItem(item)) {
					await removeRemoteItem(item.id);
				}
			}
		}

		const emptyCart = cloneCart(EMPTY_CART);
		setCart(emptyCart);
		clearStoredCart();
		return emptyCart;
	}

	async function checkout() {
		if (!cart.cartItems.length) {
			throw new Error("El carrito está vacío.");
		}

		if (!user) {
			throw new Error("Debes iniciar sesión para finalizar la compra.");
		}

		const order = await requestJson<Order>("/api/orders", {
			method: "POST",
			body: JSON.stringify({
				firstName: user.firstName,
				lastName: user.lastName,
				streetAddress: "Dirección no especificada",
				city: "Ciudad no especificada",
				state: "Estado no especificado",
				zipCode: "00000",
				mobile: user.mobile || "0000000000",
				paymentMethod: "CREDIT_CARD",
				status: "COMPLETED",
				paymentId: `SW-${Date.now()}`,
				cardholderName: `${user.firstName} ${user.lastName}`.trim() || "Cliente Shopwave",
				cardNumber: "4111111111111111",
			}),
		});

		const emptyCart = cloneCart(EMPTY_CART);
		setCart(emptyCart);
		clearStoredCart();

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
