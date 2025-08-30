// apps/web/src/hooks/useResponsiveImageSize.ts

import { Image } from '@iam/types'
import { useState, useEffect } from 'react'
import { Dimensions, ScaledSize } from 'react-native'

export const useResponsiveImageSize = (
	originalWidth?: number,
	originalHeight?: number,
	margin = 120
) => {
	const [screen, setScreen] = useState<ScaledSize>(Dimensions.get('window'))

	useEffect(() => {
		const onChange = ({ window }: { window: ScaledSize }) => setScreen(window)
		const subscription = Dimensions.addEventListener('change', onChange)
	
		return () => subscription.remove()
	}, [])

	if (!originalWidth || !originalHeight) {
		return { width: 0, height: 0 }
	}

	const maxWidth = screen.width - margin
	const maxHeight = screen.height - margin
	const aspectRatio = originalWidth / originalHeight

	let width = maxWidth
	let height = width / aspectRatio

	if (height > maxHeight) {
		height = maxHeight
		width = height * aspectRatio
	}

	return { width, height }
}
