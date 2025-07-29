// apps/web/src/shared/modals/ImageModal.tsx

import React, { useState } from 'react'
import { View, StyleSheet, useWindowDimensions } from 'react-native'
import { IconButton } from '@shared/buttons'
import { Row } from '@shared/grid'
import { AutoSizeImage } from '@shared/ui'
import { FeedbackBarContainer } from '@shared/feedback'
import { paddingHorizontal, resolveResponsiveProp, Size, withAlpha } from '@iam/theme'
import { useAuth, useTheme } from '@shared/hooks'
import { RefType, type Image } from '@iam/types'

type Props = {
	selectedImage: Image
	onClose: () => void
	onDelete?: () => void
	onSetAvatar?: (id: string | undefined) => void
	isAvatar?: boolean
}

export const ImageModal: React.FC<Props> = ({
	selectedImage,
	onClose,
	onDelete,
	onSetAvatar,
	isAvatar,
}) => {
	const [isCurrentAvatar, setIsCurrentAvatar] = useState(isAvatar)

	const { user } = useAuth()
	const { theme } = useTheme()

	const { width, height } = useWindowDimensions()
	const paddingHorizontal = resolveResponsiveProp({ xs: 8, sm: 8, md: 16, lg: 24 })

	const bestVariantUrl = selectedImage.variants.find(v => v.filename)?.filename ?? ''
	const bestVariant = selectedImage.variants.find(v => bestVariantUrl.includes(v.filename))

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
		const imagesMatch = selectedImage.id === currentAvatarId
		if (currentAvatarId && imagesMatch) {
			onSetAvatar(undefined)
			setIsCurrentAvatar(false)
		} else {
			onSetAvatar(selectedImage.id)
			setIsCurrentAvatar(true)
		}
	}

	return (
		<View style={[StyleSheet.absoluteFill, styles.fullscreenContainer, { backgroundColor: theme.colors.background }]}>
			<View style={styles.imageContainer}>
				<View style={[styles.header, { paddingHorizontal, backgroundColor: withAlpha(theme.colors.background, 0.5) }]}>

					<Row
						flex={1}
						align='center'
						justify='space-between'
						style={[styles.headerContent]}
					>
						<Row align='center' spacing={Size.M}>
							{onDelete && (
								<IconButton
                                    onPress={onDelete}
									iconName='trash-bin'
                                    iconSize={28}
								/>
							)}
							{onSetAvatar && (
								<IconButton
                                    onPress={handleSetAvatar}
									iconName='person-circle'
                                    iconSize={28}
                                    active={isCurrentAvatar}
                                />
							)}
						</Row>
						<IconButton
                            onPress={onClose}
							iconName='close-sharp'
                            iconSize={28}
                        />
					</Row>
				</View>

				<View style={styles.imageWrapper}>
					<AutoSizeImage
						image={selectedImage}
						resizeMode='contain'
						style={{ width: displayWidth, height: displayHeight }}
					/>
				</View>

				<View style={styles.footer}>
					<View style={styles.footerContent}>
						<FeedbackBarContainer
							refId={selectedImage.id}
							refType={RefType.Image}
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
        paddingHorizontal,
	},
	footerContent: {
		width: '100%',
		flexShrink: 1,
	},
})

