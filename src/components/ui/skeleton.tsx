import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn(
				"relative overflow-hidden rounded-2xl bg-slate-200/70",
				"after:absolute after:inset-0 after:-translate-x-full after:bg-gradient-to-r after:from-transparent after:via-white/60 after:to-transparent after:animate-[shimmer_1.6s_infinite]",
				className,
			)}
			{...props}
		/>
	);
}

export { Skeleton };
