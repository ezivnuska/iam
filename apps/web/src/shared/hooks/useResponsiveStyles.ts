// apps/web/src/hooks/useResponsiveStyles.ts

import { useDeviceInfo } from './useDeviceInfo'

type StyleVariants<T> = {
	mobile?: T
	desktop?: T
	portrait?: T
	landscape?: T
}

export function useResponsiveStyles<T>(variants: StyleVariants<T>): T {
	const { isMobile, orientation } = useDeviceInfo()

	if (orientation === 'portrait' && variants.portrait) {
		return variants.portrait
	}
	if (orientation === 'landscape' && variants.landscape) {
		return variants.landscape
	}
	if (isMobile && variants.mobile) {
		return variants.mobile
	}
	if (!isMobile && variants.desktop) {
		return variants.desktop
	}

	throw new Error('No matching style variant provided!')
}