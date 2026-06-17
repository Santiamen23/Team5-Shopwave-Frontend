"use client";

import { useId } from "react";
import { Search, X } from "lucide-react";

import { cn } from "@/lib/utils";

interface SearchBarProps extends Omit<React.ComponentProps<"input">, "type"> {
	label?: string;
	resultText?: string;
	wrapperClassName?: string;
	onClear?: () => void;
	showClearButton?: boolean;
}

export function SearchBar({
	className,
	label,
	resultText,
	wrapperClassName,
	id,
	value,
	onClear,
	showClearButton = true,
	...props
}: SearchBarProps) {
	const generatedId = useId();
	const inputId = id ?? generatedId;
	const hasValue = typeof value === "string" && value.length > 0;
	const showClear = showClearButton && hasValue && onClear;

	return (
		<div className={cn("space-y-2", wrapperClassName)}>
			{label ? (
				<label
					htmlFor={inputId}
					className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-slate-500"
				>
					{label}
				</label>
			) : null}
			<div className="group relative">
				<Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-brand-500" />
				<input
					id={inputId}
					type="search"
					value={value}
					className={cn(
						"h-10 w-full rounded-full border border-slate-200 bg-slate-50/60 pl-10 text-sm text-slate-900 outline-none transition-all duration-200",
						"placeholder:text-slate-400 hover:border-slate-300 hover:bg-white",
						"focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20",
						showClear ? "pr-10" : "pr-4",
						className,
					)}
					{...props}
				/>
				{showClear ? (
					<button
						type="button"
						onClick={onClear}
						className="absolute top-1/2 right-2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full bg-slate-200/80 text-slate-600 transition-colors hover:bg-slate-300 hover:text-slate-900"
						aria-label="Limpiar búsqueda"
					>
						<X className="h-3 w-3" />
					</button>
				) : null}
			</div>
			{resultText ? (
				<p className="text-xs text-slate-500">{resultText}</p>
			) : null}
		</div>
	);
}
