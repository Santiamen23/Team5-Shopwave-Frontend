import type { UserProfile } from "./user.model";

export interface Review {
	id: number;
	review: string;
	user: UserProfile;
	createdAt: string | null;
}
