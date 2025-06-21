// apps/web/src/components/Posts/LinkPreview.tsx

import React, { useEffect, useMemo, useState } from 'react'
import { Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Column } from '@/components'
import { paddingHorizontal, resolveResponsiveProp, Size } from '@/styles'

type LinkPreviewProps = {
	url: string
	preview: {
		title?: string
		description?: string
		image?: string
	}
}

export const LinkPreview: React.FC<LinkPreviewProps> = ({ url, preview }) => {
	const [aspectRatio, setAspectRatio] = useState<number>(1)

	const maxWidth = useMemo(
		() => resolveResponsiveProp({ xs: 400, sm: 400, md: 400 - paddingHorizontal * 2, lg: 400 - paddingHorizontal * 2 }),
		[]
	)

	useEffect(() => {
		if (!preview.image) return
		Image.getSize(
			preview.image,
			(w, h) => setAspectRatio(w / h),
			() => setAspectRatio(1)
		)
	}, [preview.image])

	const openExternalUrl = () => {
		Linking.openURL(url).catch(err => console.error('Error opening URL:', err))
	}
	
	if (!preview?.title && !preview?.description && !preview?.image) return null

	return (
		<TouchableOpacity onPress={openExternalUrl}>
			<Column spacing={16}>
				{preview.image && (
					<View style={{ width: '100%', maxWidth, marginHorizontal: 'auto' }}>
						<Image
							source={{ uri: preview.image }}
							style={{ width: '100%', aspectRatio }}
							resizeMode='cover'
						/>
					</View>
				)}
				<Column spacing={Size.XS} paddingHorizontal={paddingHorizontal}>
					{preview.title && <Text style={styles.heading}>{preview.title}</Text>}
					{preview.description && <Text style={styles.description}>{preview.description}</Text>}
				</Column>
			</Column>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	heading: {
		fontSize: 16,
		fontWeight: '700',
		lineHeight: 20,
	},
	description: {
		fontSize: 14,
		color: '#333',
	},
})
