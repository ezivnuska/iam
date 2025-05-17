// app/web/src/components/ProfileImage.tsx

import React from 'react'
import { View, Text, Image } from 'react-native'

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

export const ProfileImage = ({
	url,
	username,
	size = 'md',
}: {
	url?: string
	username: string
	size?: ProfileImageSize
}) => {
	const imageSize = sizeMap[size]
	const fontSize = fontSizeMap[size]

	return url ? (
		<Image
			source={{ uri: url }}
			style={{
				width: imageSize,
				height: imageSize,
				borderRadius: imageSize / 2,
				backgroundColor: '#ddd',
			}}
		/>
	) : (
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
		<Text style={{ fontSize, color: '#555', fontWeight: 'bold' }}>
			{username?.charAt(0).toUpperCase() || '?'}
		</Text>
		</View>
	)
}