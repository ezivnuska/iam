// app/web/src/components/ProfileImage.tsx

import React from 'react'
import { View, Text } from 'react-native'
import AutoSizeImage from './AutoSizeImage'
import type { Image } from '@iam/types'

type ProfileImageSize = 'xs' | 'sm' | 'md' | 'lg'

const sizeMap: Record<ProfileImageSize, number> = {
	xs: 24,
	sm: 32,
	md: 40,
	lg: 48,
}

const fontSizeMap: Record<ProfileImageSize, number> = {
	xs: 12,
	sm: 18,
	md: 24,
	lg: 36,
}

interface ProfileImageProps {
	user?: {
		username?: string
		avatar?: Image
	}
	size?: ProfileImageSize
}

export const ProfileImage: React.FC<ProfileImageProps> = ({ user, size = 'md' }) => {
	const imageSize = sizeMap[size]
	const fontSize = fontSizeMap[size]
	const initials = user?.username?.charAt(0).toUpperCase() || '?'
    const avatar = user?.avatar
    console.log('size', size)
	if (avatar) {
		return (
			<View
				style={{
					width: imageSize,
					height: imageSize,
					borderRadius: imageSize / 2,
					overflow: 'hidden',
					backgroundColor: '#ddd',
					alignSelf: 'flex-start',
				}}
			>
                <AutoSizeImage
                    image={avatar}
                    style={{ width: imageSize, height: imageSize }}
                />
            </View>
		)
	}

	return (
		<View
			style={{
				width: imageSize,
				height: imageSize,
				borderRadius: imageSize / 2,
				backgroundColor: '#ccc',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<Text style={{ fontSize, color: '#555', fontWeight: 'bold' }}>{initials}</Text>
		</View>
	)
}