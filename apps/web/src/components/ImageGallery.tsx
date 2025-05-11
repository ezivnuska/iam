import React from 'react'
import { Image, ScrollView, View, StyleSheet } from 'react-native'
import { Button, Column } from '.'
import type { ImageItem } from '@iam/types'

type ImageGalleryProps = {
	images: ImageItem[]
	currentAvatarId?: string
	onDelete?: (id: string) => void
	onSetAvatar?: (id: string) => void
}

const ImageGallery = ({ images, onDelete, onSetAvatar, currentAvatarId }: ImageGalleryProps) => {
	return (
		<ScrollView contentContainerStyle={styles.gallery}>
			{images.map((img, index) => {
				const isAvatar = img._id === currentAvatarId
                console.log('img', img)
				return (
					<Column
						key={`${index}-${img._id}`}
						spacing={10}
						style={styles.imageBlock}
					>
						<View style={[styles.imageWrapper, isAvatar && styles.avatarHighlight]}>
							<Image
								source={{ uri: img.url }}
								style={styles.image}
								resizeMode='cover'
							/>
						</View>
						<View style={styles.buttonRow}>
							<Button label='Delete' onPress={() => onDelete?.(img._id)} />
							{!isAvatar && (
								<Button label='Set as Avatar' onPress={() => onSetAvatar?.(img._id)} />
							)}
						</View>
					</Column>
				)
			})}
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	gallery: {
		padding: 16,
	},
	imageBlock: {
		marginBottom: 20,
		alignItems: 'center',
	},
	imageWrapper: {
		borderRadius: 8,
		overflow: 'hidden',
	},
	avatarHighlight: {
		borderWidth: 3,
		borderColor: '#3498db',
	},
	image: {
		width: 200,
		height: 200,
	},
	buttonRow: {
		flexDirection: 'row',
		gap: 12,
	},
})

export default ImageGallery