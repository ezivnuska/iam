// packages/theme/src/utils/colorUtils.ts

export function withAlpha(hex: string, alpha: number): string {
	const [r, g, b] = hexToRgb(hex)
	return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function hexToRgb(hex: string): [number, number, number] {
	let parsed = hex.replace(/^#/, '')

	if (parsed.length === 3) {
		parsed = parsed.split('').map((c) => c + c).join('')
	}

	const bigint = parseInt(parsed, 16)
	const r = (bigint >> 16) & 255
	const g = (bigint >> 8) & 255
	const b = bigint & 255

	return [r, g, b]
}
