import { Check, Clock, Package, Truck, PackageCheck, X, Circle } from "lucide-react";

import type { OrderStatus } from "@/models/order.model";
import { cn } from "@/lib/utils";

const STEPS: Array<{
	status: OrderStatus;
	label: string;
	icon: React.ComponentType<{ className?: string }>;
}> = [
	{ status: "PENDING", label: "Pendiente", icon: Clock },
	{ status: "PLACED", label: "Recibido", icon: Package },
	{ status: "CONFIRMED", label: "Confirmado", icon: Check },
	{ status: "SHIPPED", label: "Enviado", icon: Truck },
	{ status: "DELIVERED", label: "Entregado", icon: PackageCheck },
];

function getStepIndex(status: OrderStatus): number {
	if (status === "CANCELLED") return -1;
	const idx = STEPS.findIndex((s) => s.status === status);
	return idx === -1 ? 0 : idx;
}

interface OrderStatusStepperProps {
	status: OrderStatus;
	variant?: "default" | "compact";
	className?: string;
}

export function OrderStatusStepper({
	status,
	variant = "default",
	className,
}: OrderStatusStepperProps) {
	const currentIndex = getStepIndex(status);
	const isCancelled = status === "CANCELLED";

	if (variant === "compact") {
		return (
			<div className={cn("flex items-center gap-1", className)}>
				{STEPS.map((step, index) => {
					const isDone = !isCancelled && index < currentIndex;
					const isCurrent = !isCancelled && index === currentIndex;
					const Icon = isCancelled && index === 0 ? X : step.icon;
					return (
						<div
							key={step.status}
							className={cn(
								"flex h-7 w-7 items-center justify-center rounded-full border-2 transition-colors",
								isDone
									? "border-brand-600 bg-brand-600 text-white"
									: isCurrent
										? "border-brand-600 bg-white text-brand-600 shadow-[0_0_0_3px_oklch(0.94_0.04_245_/_0.5)]"
										: "border-slate-200 bg-white text-slate-300",
							)}
							title={step.label}
						>
							<Icon className="h-3.5 w-3.5" />
						</div>
					);
				})}
			</div>
		);
	}

	return (
		<div className={cn("w-full", className)}>
			<ol className="flex items-center justify-between gap-1 sm:gap-2">
				{STEPS.map((step, index) => {
					const isDone = !isCancelled && index < currentIndex;
					const isCurrent = !isCancelled && index === currentIndex;
					const Icon = isCurrent && step.status === "DELIVERED" ? Check : step.icon;

					return (
						<li
							key={step.status}
							className="flex flex-1 items-center"
						>
							<div className="flex flex-col items-center gap-1.5">
								<div
									className={cn(
										"grid h-8 w-8 place-items-center rounded-full border-2 transition-all sm:h-9 sm:w-9",
										isCancelled && step.status === "PENDING"
											? "border-danger-500 bg-danger-500 text-white"
											: isDone
												? "border-brand-600 bg-brand-600 text-white shadow-[0_4px_12px_-4px_oklch(0.43_0.18_245_/_0.5)]"
												: isCurrent
													? "border-brand-600 bg-white text-brand-600 shadow-[0_0_0_4px_oklch(0.94_0.04_245_/_0.55)]"
													: "border-slate-200 bg-white text-slate-300",
									)}
								>
									{isCancelled && step.status === "PENDING" ? (
										<X className="h-4 w-4" />
									) : isDone ? (
										<Check className="h-4 w-4" />
									) : (
										<Icon className="h-4 w-4" />
									)}
								</div>
								<span
									className={cn(
										"hidden text-[0.6rem] font-semibold uppercase tracking-wider sm:block",
										isCurrent
											? "text-brand-700"
											: isDone
												? "text-slate-700"
												: "text-slate-400",
									)}
								>
									{step.label}
								</span>
							</div>
							{index < STEPS.length - 1 ? (
								<div
									className={cn(
										"mx-1 h-0.5 flex-1 rounded-full sm:mx-2",
										isDone ? "bg-brand-600" : "bg-slate-200",
									)}
								/>
							) : null}
						</li>
					);
				})}
			</ol>
			{isCancelled ? (
				<p className="mt-2 text-center text-xs font-semibold text-danger-700">
					Orden cancelada
				</p>
			) : null}
		</div>
	);
}

interface OrderStatusProgressProps {
	status: OrderStatus;
	steps?: number;
}

export function OrderStatusProgress({
	status,
	steps = 5,
}: OrderStatusProgressProps) {
	const currentIndex = getStepIndex(status);
	const progress = currentIndex >= 0 ? ((currentIndex + 1) / steps) * 100 : 0;
	const isCancelled = status === "CANCELLED";

	return (
		<div className="flex items-center gap-2">
			<div className="relative h-1.5 w-16 overflow-hidden rounded-full bg-slate-200">
				<div
					className={cn(
						"h-full rounded-full transition-all",
						isCancelled ? "bg-danger-500" : "bg-gradient-to-r from-brand-500 to-brand-700",
					)}
					style={{ width: `${isCancelled ? 100 : progress}%` }}
				/>
			</div>
			{isCancelled ? (
				<X className="h-3.5 w-3.5 text-danger-500" />
			) : currentIndex === steps - 1 ? (
				<Check className="h-3.5 w-3.5 text-success-600" />
			) : (
				<Circle className="h-3.5 w-3.5 text-brand-500" />
			)}
		</div>
	);
}
