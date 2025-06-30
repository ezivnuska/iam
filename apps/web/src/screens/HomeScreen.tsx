// apps/web/src/screens/HomeScreen.tsx

import React from 'react'
import { AnimatedPageLayout, PostFeed } from '@/components'
import { useScrollHeaderFooterVisibility } from '@/hooks'

export const HomeScreen = () => {
	const {
		pageLayoutRef,
		onLayoutTrigger,
		debouncedShowHeaderFooter,
	} = useScrollHeaderFooterVisibility()

	return (
		<AnimatedPageLayout ref={pageLayoutRef}>
			<PostFeed
				onScrollDirectionChange={onLayoutTrigger}
				onScrolledToTop={debouncedShowHeaderFooter}
				onScrolledToBottom={debouncedShowHeaderFooter}
			/>
		</AnimatedPageLayout>
	)
}
