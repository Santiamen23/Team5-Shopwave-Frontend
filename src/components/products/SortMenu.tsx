"use client";

import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SORT_OPTIONS, type SortKey } from "./product-filters";

interface SortMenuProps {
	value: SortKey;
	onChange: (sort: SortKey) => void;
}

export function SortMenu({ value, onChange }: SortMenuProps) {
	const current = SORT_OPTIONS.find((option) => option.value === value);
	const label = current?.label ?? "Ordenar";

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="secondary"
					className="w-full justify-between sm:w-auto"
				>
					<span className="flex items-center gap-2">
						<ArrowUpDown className="h-4 w-4" />
						Ordenar:
						<span className="text-slate-500">{label}</span>
					</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="min-w-56">
				<DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
				<DropdownMenuRadioGroup
					value={value}
					onValueChange={(next) => onChange(next as SortKey)}
				>
					{SORT_OPTIONS.map((option) => (
						<DropdownMenuRadioItem key={option.value} value={option.value}>
							{option.label}
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
