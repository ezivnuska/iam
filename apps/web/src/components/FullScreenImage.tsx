// apps/web/src/components/FullScreenImage.tsx

import React, { useState } from 'react'
import { View, StyleSheet, Pressable, useWindowDimensions } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import {
	AutoSizeImage,
	Row,
	LikeCommentBarContainer,
} from '@/components'
import { Size, resolveResponsiveProp } from '@/styles'
import { useAuth } from '@/hooks'
import type { Image } from '@iam/types'

type Props = {
	image: Image
	onClose: () => void
	onDelete?: () => void
	onSetAvatar?: (id: string | undefined) => void
	isAvatar?: boolean
}

const FullScreenImage: React.FC<Props> = ({
	image,
	onClose,
	onDelete,
	onSetAvatar,
	isAvatar,
}) => {
	const [expanded, setExpanded] = useState(false)
	const [isCurrentAvatar, setIsCurrentAvatar] = useState(isAvatar)

	const { user } = useAuth()

	const { width, height } = useWindowDimensions()
	const paddingHorizontal = resolveResponsiveProp({ xs: 8, sm: 8, md: 16, lg: 24 })

	const bestVariantUrl = image.variants.find(v => v.filename)?.filename ?? ''
	const bestVariant = image.variants.find(v => bestVariantUrl.includes(v.filename))

	let displayWidth = width - paddingHorizontal * 2
	let displayHeight = height - paddingHorizontal * 2

	if (bestVariant?.width && bestVariant?.height) {
		const aspectRatio = bestVariant.width / bestVariant.height
		if (displayWidth / aspectRatio <= displayHeight) {
			displayHeight = displayWidth / aspectRatio
		} else {
			displayWidth = displayHeight * aspectRatio
		}
	}

	const handleSetAvatar = () => {
		if (!onSetAvatar) return
		const currentAvatarId = user?.avatar?.id
		const imagesMatch = image.id === currentAvatarId
		if (currentAvatarId && imagesMatch) {
			onSetAvatar(undefined)
			setIsCurrentAvatar(false)
		} else {
			onSetAvatar(image.id)
			setIsCurrentAvatar(true)
		}
	}

	return (
		<View style={[StyleSheet.absoluteFill, styles.fullscreenContainer]}>
			<View style={styles.imageContainer}>
				{/* Header */}
				<View style={[styles.header, { paddingHorizontal }]}>
					<Row
						flex={1}
						align='center'
						justify='space-between'
						style={[styles.headerContent]}
					>
						<Row align='center' spacing={Size.M}>
							{onDelete && (
								<Pressable onPress={onDelete}>
									<Ionicons name='trash-bin' size={28} color='#fff' />
								</Pressable>
							)}
							{onSetAvatar && (
								<Pressable onPress={handleSetAvatar}>
									<FontAwesome
										name='user-circle-o'
										size={24}
										color={isCurrentAvatar ? '#3498db' : '#fff'}
									/>
								</Pressable>
							)}
						</Row>
						<Pressable onPress={onClose}>
							<Ionicons name='close-sharp' size={28} color='#fff' />
						</Pressable>
					</Row>
				</View>

				{/* Image */}
				<View style={styles.imageWrapper}>
					<AutoSizeImage
						image={image}
						resizeMode='contain'
						style={{ width: displayWidth, height: displayHeight }}
					/>
				</View>

				{/* Footer */}
				<View style={styles.footer}>
					<View
						style={[
							styles.footerContent,
							expanded && { backgroundColor: 'rgba(0,0,0,0.7)' },
						]}
					>
						<LikeCommentBarContainer
							refId={image.id}
							refType='Image'
							expanded={expanded}
							setExpanded={setExpanded}
							textColor='#fff'
							iconColor='#fff'
							disabledComment={false}
						/>
					</View>
				</View>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	fullscreenContainer: {
		flex: 1,
		backgroundColor: '#000',
	},
	imageContainer: {
		flex: 1,
		position: 'relative',
	},
	header: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		height: 50,
		zIndex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'rgba(0,0,0,0.4)',
	},
	headerContent: {
		width: '100%',
		paddingHorizontal: Size.S,
	},
	imageWrapper: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	footer: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		zIndex: 10,
		backgroundColor: 'rgba(0,0,0,0.4)',
		maxHeight: '50%',
	},
	footerContent: {
		width: '100%',
		paddingHorizontal: Size.S,
		flexShrink: 1,
	},
})

export default FullScreenImage
