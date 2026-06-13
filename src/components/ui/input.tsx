import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
	invalid?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type = "text", invalid, ...props }, ref) => {
		return (
			<input
				ref={ref}
				type={type}
				aria-invalid={invalid || undefined}
				className={cn(
					"flex h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200",
					"focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
					invalid
						? "border-danger-500 focus-visible:border-danger-500 focus-visible:ring-danger-500/30"
						: "border-slate-200 hover:border-slate-300 focus-visible:border-brand-500 focus-visible:ring-brand-500/20",
					"disabled:cursor-not-allowed disabled:opacity-50",
					className,
				)}
				{...props}
			/>
		);
	},
);
Input.displayName = "Input";

export interface TextareaProps
	extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	invalid?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
	({ className, invalid, ...props }, ref) => {
		return (
			<textarea
				ref={ref}
				aria-invalid={invalid || undefined}
				className={cn(
					"flex min-h-[88px] w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200",
					"focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
					invalid
						? "border-danger-500 focus-visible:border-danger-500 focus-visible:ring-danger-500/30"
						: "border-slate-200 hover:border-slate-300 focus-visible:border-brand-500 focus-visible:ring-brand-500/20",
					"disabled:cursor-not-allowed disabled:opacity-50",
					className,
				)}
				{...props}
			/>
		);
	},
);
Textarea.displayName = "Textarea";

export interface LabelProps
	extends React.LabelHTMLAttributes<HTMLLabelElement> {
	required?: boolean;
}

function Label({ className, required, children, ...props }: LabelProps) {
	return (
		<label
			className={cn(
				"mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-600",
				className,
			)}
			{...props}
		>
			{children}
			{required ? <span className="ml-1 text-danger-600">*</span> : null}
		</label>
	);
}

export interface FormFieldProps {
	id: string;
	label: string;
	error?: string;
	hint?: string;
	required?: boolean;
	children: React.ReactNode;
	className?: string;
}

function FormField({ id, label, error, hint, required, children, className }: FormFieldProps) {
	return (
		<div className={className}>
			<Label htmlFor={id} required={required}>
				{label}
			</Label>
			{children}
			{hint && !error ? (
				<p className="mt-1.5 text-xs text-slate-500">{hint}</p>
			) : null}
			{error ? (
				<p className="mt-1.5 text-xs font-medium text-danger-600">{error}</p>
			) : null}
		</div>
	);
}

export { Input, Textarea, Label, FormField };
