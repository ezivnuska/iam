// apps/web/src/hooks/useButtonStyles.ts

import { useTheme } from './useTheme'
import { getBaseButtonStyles, getButtonVariantStyles } from '@iam/theme'

export const useButtonStyles = () => {
	const { theme } = useTheme()

	return {
		baseButtonStyles: getBaseButtonStyles(theme),
		buttonVariants: getButtonVariantStyles(theme),
	}
}
