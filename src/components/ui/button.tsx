import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-transparent bg-clip-padding text-sm font-semibold whitespace-nowrap transition-colors duration-200 outline-none select-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-danger-500 aria-invalid:ring-2 aria-invalid:ring-danger-500/30 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg]:transition-transform [&_svg]:duration-200 group-hover/button:[&_svg]:translate-x-0.5",
	{
		variants: {
			variant: {
				default:
					"bg-brand-600 text-white hover:bg-brand-700 focus-visible:ring-brand-500",
				brand: "bg-brand-600 text-white hover:bg-brand-700 focus-visible:ring-brand-500",
				secondary:
					"border border-slate-200 bg-white text-slate-900 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 focus-visible:ring-brand-500",
				outline:
					"border border-slate-200 bg-white/80 text-slate-800 backdrop-blur hover:border-brand-400 hover:bg-brand-50 hover:text-brand-700 focus-visible:ring-brand-500",
				ghost:
					"text-slate-700 hover:bg-brand-50 hover:text-brand-700 focus-visible:ring-brand-500",
				soft: "bg-brand-50 text-brand-700 hover:bg-brand-100 focus-visible:ring-brand-500",
				destructive:
					"bg-danger-600 text-white hover:bg-danger-700 focus-visible:ring-danger-500",
				success:
					"bg-success-600 text-white hover:bg-success-700 focus-visible:ring-success-500",
				link: "text-brand-700 underline-offset-4 hover:underline hover:text-brand-600 px-0",
			},
			size: {
				default: "h-10 px-4 text-sm",
				xs: "h-7 rounded-lg px-2.5 text-xs",
				sm: "h-9 rounded-lg px-3 text-sm",
				lg: "h-12 rounded-2xl px-6 text-base",
				xl: "h-14 rounded-2xl px-7 text-base",
				icon: "size-10 rounded-xl",
				"icon-xs": "size-7 rounded-lg",
				"icon-sm": "size-9 rounded-lg",
				"icon-lg": "size-12 rounded-2xl",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

function Button({
	className,
	variant = "default",
	size = "default",
	asChild = false,
	...props
}: React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
	}) {
	const Comp = asChild ? Slot.Root : "button";

	return (
		<Comp
			data-slot="button"
			data-variant={variant}
			data-size={size}
			className={cn(buttonVariants({ variant, size }), className)}
			{...props}
		/>
	);
}

export { Button, buttonVariants };
