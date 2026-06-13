"use client";

import { useId } from "react";

import { Search } from "lucide-react";

import { cn } from "@/lib/utils";

interface SearchBarProps extends Omit<React.ComponentProps<"input">, "type"> {
	label?: string;
	resultText?: string;
	wrapperClassName?: string;
}

export function SearchBar({
	className,
	label = "Buscar",
	resultText,
	wrapperClassName,
	id,
	...props
}: SearchBarProps) {
	const generatedId = useId();
	const inputId = id ?? generatedId;

	return (
		<div className={cn("space-y-3", wrapperClassName)}>
			<label htmlFor={inputId} className="text-sm font-semibold text-slate-700">
				{label}
			</label>
			<div className="group relative">
				<Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-brand-500" />
				<input
					id={inputId}
					type="search"
					className={cn(
						"h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition-all duration-200",
						"placeholder:text-slate-400 hover:border-slate-300",
						"focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20",
						className,
					)}
					{...props}
				/>
			</div>
			{resultText ? <p className="text-sm text-slate-500">{resultText}</p> : null}
		</div>
	);
}
