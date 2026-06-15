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

const ROLE_COLORS: Record<string, string> = {
	ROLE_ADMIN: "bg-slate-800 text-white",
	ROLE_USER: "bg-brand-600 text-white",
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
	const colorClass = ROLE_COLORS[role] ?? ROLE_COLORS.ROLE_USER;
	const fullName = `${firstName} ${lastName}`.trim() || "Usuario";

	return (
		<div className={cn("flex items-center gap-3", className)}>
			<div
				className={cn(
					"grid shrink-0 place-items-center rounded-xl font-semibold",
					SIZES[size],
					colorClass,
				)}
				aria-label={`Avatar de ${fullName}`}
			>
				{initials}
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
