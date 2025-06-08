// apps/web/src/utils/getAvatarPlaceholder.ts

export const getAvatarPlaceholder = (name: string) =>
	`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random` || undefined