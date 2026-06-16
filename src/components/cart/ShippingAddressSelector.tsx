"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, MapPin, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FormField, Input } from "@/components/ui/input";
import type { UserAddress } from "@/models/user.model";
import {
	isAddressValid,
	sanitizeAddress,
	validateAddress,
	type AddressFieldErrors,
	type SanitizedAddress,
} from "@/utils/address.validation";

export type AddressSelection =
	| { type: "existing"; addressId: number; address: UserAddress }
	| { type: "new"; address: SanitizedAddress }
	| null;

interface ShippingAddressSelectorProps {
	addresses: UserAddress[];
	userFirstName?: string;
	userLastName?: string;
	userMobile?: string;
	onChange: (selection: AddressSelection) => void;
	showErrors?: boolean;
}

function createEmptyAddress(
	userFirstName?: string,
	userLastName?: string,
	userMobile?: string,
): SanitizedAddress {
	return {
		firstName: userFirstName ?? "",
		lastName: userLastName ?? "",
		streetAddress: "",
		city: "",
		state: "",
		zipCode: "",
		mobile: userMobile ?? "",
	};
}

export function ShippingAddressSelector({
	addresses,
	userFirstName,
	userLastName,
	userMobile,
	onChange,
	showErrors = false,
}: ShippingAddressSelectorProps) {
	const hasAddresses = addresses.length > 0;
	const [selectedId, setSelectedId] = useState<number | "new">(() =>
		hasAddresses ? addresses[0].id ?? "new" : "new",
	);
	const [newAddress, setNewAddress] = useState<SanitizedAddress>(() =>
		createEmptyAddress(userFirstName, userLastName, userMobile),
	);

	const errors = useMemo<AddressFieldErrors>(
		() => (selectedId === "new" ? validateAddress(newAddress) : {}),
		[selectedId, newAddress],
	);

	useEffect(() => {
		if (selectedId === "new") {
			if (isAddressValid(newAddress)) {
				onChange({ type: "new", address: sanitizeAddress(newAddress) });
			} else {
				onChange(null);
			}
			return;
		}

		const addr = addresses.find((current) => current.id === selectedId);
		if (addr && addr.id != null) {
			onChange({ type: "existing", addressId: addr.id, address: addr });
		}
	}, [selectedId, newAddress, addresses, onChange]);

	function handleSelectExisting(id: number) {
		setSelectedId(id);
	}

	function handleSelectNew() {
		setSelectedId("new");
	}

	function handleNewAddressChange<K extends keyof SanitizedAddress>(
		field: K,
		value: SanitizedAddress[K],
	) {
		setNewAddress((prev) => ({ ...prev, [field]: value }));
	}

	const showNewForm = !hasAddresses || selectedId === "new";

	return (
		<div className="space-y-4">
			{hasAddresses ? (
				<div className="space-y-2">
					<p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
						Direcciones guardadas
					</p>
					<div className="grid gap-2">
						{addresses.map((addr) => {
							const isSelected = selectedId === addr.id;
							return (
								<button
									key={addr.id}
									type="button"
									onClick={() => handleSelectExisting(addr.id!)}
									className={`flex items-start gap-3 rounded-xl border p-3 text-left transition-all duration-200 ${
										isSelected
											? "border-brand-600 bg-brand-50 ring-2 ring-brand-500/20"
											: "border-slate-200 bg-white hover:border-brand-300 hover:bg-brand-50/50"
									}`}
								>
									<div
										className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition-all ${
											isSelected
												? "border-brand-600 bg-brand-600 text-white"
												: "border-slate-300 bg-white"
										}`}
									>
										{isSelected ? <Check className="h-3 w-3" /> : null}
									</div>
									<div className="min-w-0 flex-1">
										<p className="text-sm font-semibold text-slate-900">
											{addr.firstName} {addr.lastName}
										</p>
										<p className="mt-0.5 text-xs text-slate-600">
											{addr.streetAddress}
										</p>
										<p className="text-xs text-slate-600">
											{addr.city}, {addr.state} {addr.zipCode}
										</p>
										<p className="mt-1 text-xs text-slate-500">{addr.mobile}</p>
									</div>
								</button>
							);
						})}
					</div>

					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={handleSelectNew}
						className={`w-full justify-start text-sm ${
							selectedId === "new"
								? "bg-brand-50 text-brand-700 hover:bg-brand-100 hover:text-brand-700"
								: "text-slate-600"
						}`}
					>
						<Plus className="h-4 w-4" />
						Usar una dirección nueva
					</Button>
				</div>
			) : null}

			{showNewForm ? (
				<div
					className={`space-y-3 rounded-xl border bg-slate-50/50 p-4 ${
						hasAddresses ? "border-brand-200" : "border-slate-200"
					}`}
				>
					<div className="flex items-center gap-2">
						<MapPin className="h-4 w-4 text-brand-600" />
						<p className="text-sm font-semibold text-slate-900">
							{hasAddresses
								? "Nueva dirección de envío"
								: "Agrega tu primera dirección de envío"}
						</p>
					</div>

					<div className="grid gap-3 sm:grid-cols-2">
						<FormField
							id="shipping-firstName"
							label="Nombre"
							required
							error={showErrors ? errors.firstName : undefined}
						>
							<Input
								id="shipping-firstName"
								value={newAddress.firstName}
								onChange={(event) =>
									handleNewAddressChange("firstName", event.target.value)
								}
								invalid={Boolean(showErrors && errors.firstName)}
							/>
						</FormField>
						<FormField
							id="shipping-lastName"
							label="Apellido"
							required
							error={showErrors ? errors.lastName : undefined}
						>
							<Input
								id="shipping-lastName"
								value={newAddress.lastName}
								onChange={(event) =>
									handleNewAddressChange("lastName", event.target.value)
								}
								invalid={Boolean(showErrors && errors.lastName)}
							/>
						</FormField>
						<FormField
							id="shipping-streetAddress"
							label="Dirección"
							required
							error={showErrors ? errors.streetAddress : undefined}
							className="sm:col-span-2"
						>
							<Input
								id="shipping-streetAddress"
								value={newAddress.streetAddress}
								onChange={(event) =>
									handleNewAddressChange("streetAddress", event.target.value)
								}
								invalid={Boolean(showErrors && errors.streetAddress)}
							/>
						</FormField>
						<FormField
							id="shipping-city"
							label="Ciudad"
							required
							error={showErrors ? errors.city : undefined}
						>
							<Input
								id="shipping-city"
								value={newAddress.city}
								onChange={(event) =>
									handleNewAddressChange("city", event.target.value)
								}
								invalid={Boolean(showErrors && errors.city)}
							/>
						</FormField>
						<FormField
							id="shipping-state"
							label="Estado / Departamento"
							required
							error={showErrors ? errors.state : undefined}
						>
							<Input
								id="shipping-state"
								value={newAddress.state}
								onChange={(event) =>
									handleNewAddressChange("state", event.target.value)
								}
								invalid={Boolean(showErrors && errors.state)}
							/>
						</FormField>
						<FormField
							id="shipping-zipCode"
							label="Código postal"
							required
							error={showErrors ? errors.zipCode : undefined}
						>
							<Input
								id="shipping-zipCode"
								value={newAddress.zipCode}
								onChange={(event) =>
									handleNewAddressChange("zipCode", event.target.value)
								}
								invalid={Boolean(showErrors && errors.zipCode)}
							/>
						</FormField>
						<FormField
							id="shipping-mobile"
							label="Celular"
							required
							error={showErrors ? errors.mobile : undefined}
						>
							<Input
								id="shipping-mobile"
								type="tel"
								value={newAddress.mobile}
								onChange={(event) =>
									handleNewAddressChange("mobile", event.target.value)
								}
								invalid={Boolean(showErrors && errors.mobile)}
							/>
						</FormField>
					</div>
				</div>
			) : null}
		</div>
	);
}
