import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
	"inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
	{
		variants: {
			variant: {
				default:
					"border-transparent bg-gradient-to-br from-brand-600 to-brand-700 text-white shadow-[0_4px_12px_-6px_oklch(0.43_0.18_245_/_0.5)]",
				brand: "border-brand-200 bg-brand-50 text-brand-700",
				secondary: "border-slate-200 bg-slate-100 text-slate-700",
				outline: "border-slate-200 bg-white text-slate-700",
				soft: "border-transparent bg-brand-50 text-brand-700",
				success:
					"border-success-500/30 bg-success-50 text-success-700",
				warning:
					"border-warning-500/30 bg-warning-50 text-warning-700",
				info: "border-info-500/30 bg-info-50 text-info-700",
				danger: "border-danger-500/30 bg-danger-50 text-danger-700",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

export interface BadgeProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
	return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
