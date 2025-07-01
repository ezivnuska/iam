// apps/web/src/components/forms/types/index.ts

export type FieldConfig<T> = {
	name: keyof T
	label: string
	secure?: boolean
	autoFocus?: boolean
}

export type AuthMode = 'signin' | 'signup'