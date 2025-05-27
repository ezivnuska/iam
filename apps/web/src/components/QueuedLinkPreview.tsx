// apps/web/src/components/QueuedLinkPreview.tsx

import React, { useEffect, useState } from 'react'
import { LinkPreview } from '@/components'

type Props = {
	id: string
	url: string
	enqueue: (id: string, url: string, done: () => void) => void
	shouldRender: (id: string) => boolean
}  

export const QueuedLinkPreview: React.FC<Props> = ({ id, url, enqueue, shouldRender }) => {
	const [canRender, setCanRender] = useState(shouldRender(id))

	useEffect(() => {
		let mounted = true
		if (!canRender) {
			enqueue(id, url, () => {
				if (mounted) setCanRender(true)
			})
		}
		return () => { mounted = false }
	}, [canRender, id, url, enqueue])	

	if (!canRender) return null

	return <LinkPreview url={url} />
}
