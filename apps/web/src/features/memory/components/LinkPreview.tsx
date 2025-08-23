// apps/web/src/features/feed/components/LinkPreview.tsx

import React, { useEffect, useState } from 'react'
import { Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Column } from '@shared/grid'
import { Size } from '@iam/theme'
import { useTheme } from '@shared/hooks'

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
    const { theme } = useTheme()

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
					<View style={{ width: '100%', marginHorizontal: 'auto' }}>
						<Image
							source={{ uri: preview.image }}
							style={{ width: '100%', aspectRatio }}
							resizeMode='cover'
						/>
					</View>
				)}
				<Column spacing={Size.XS}>
					{preview.title && <Text style={[styles.title, { color: theme.colors.text }]}>{preview.title}</Text>}
					{preview.description && <Text style={[styles.description, { color: theme.colors.textSecondary }]}>{preview.description}</Text>}
				</Column>
			</Column>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	title: {
		fontSize: 16,
		fontWeight: '700',
		lineHeight: 20,
	},
	description: {
		fontSize: 14,
	},
})
