import { cn } from "@/lib/utils";

interface CustomerAvatarProps {
	firstName: string;
	lastName: string;
	email?: string;
	role?: string;
	size?: "sm" | "md" | "lg";
	className?: string;
}

const SIZES = {
	sm: "h-8 w-8 text-xs",
	md: "h-10 w-10 text-sm",
	lg: "h-12 w-12 text-base",
} as const;

function getInitials(firstName: string, lastName: string) {
	const f = (firstName || "").trim();
	const l = (lastName || "").trim();
	return `${f[0] || ""}${l[0] || ""}`.toUpperCase() || "U";
}

const ROLE_GRADIENTS: Record<string, string> = {
	ROLE_ADMIN: "from-slate-700 via-slate-800 to-slate-950",
	ROLE_USER: "from-brand-500 via-brand-600 to-brand-800",
};

export function CustomerAvatar({
	firstName,
	lastName,
	email,
	role = "ROLE_USER",
	size = "md",
	className,
}: CustomerAvatarProps) {
	const initials = getInitials(firstName, lastName);
	const gradient = ROLE_GRADIENTS[role] ?? ROLE_GRADIENTS.ROLE_USER;
	const fullName = `${firstName} ${lastName}`.trim() || "Usuario";

	return (
		<div className={cn("flex items-center gap-3", className)}>
			<div
				className={cn(
					"relative grid shrink-0 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br font-semibold text-white shadow-[0_8px_24px_-8px_oklch(0.43_0.18_245_/_0.55)]",
					SIZES[size],
					gradient,
				)}
				aria-label={`Avatar de ${fullName}`}
			>
				<span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,oklch(1_0_0_/_0.45),transparent_60%)]" />
				<span className="relative">{initials}</span>
			</div>
			{email ? (
				<div className="min-w-0">
					<p className="truncate text-sm font-semibold text-slate-900">
						{fullName}
					</p>
					<p className="truncate text-xs text-slate-500">{email}</p>
				</div>
			) : null}
		</div>
	);
}
