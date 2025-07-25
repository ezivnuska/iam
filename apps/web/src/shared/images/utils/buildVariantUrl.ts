// apps/web/src/shared/images/utils/buildVariantUrl.ts

export function buildVariantUrl(baseUrl: string, variantSize: string) {
	if (!baseUrl) return ''
	const parts = baseUrl.split('/')
	const filename = parts.pop() ?? ''
	const prefix = `${variantSize}-`
	return [...parts, `${prefix}${filename}`].join('/')
}
