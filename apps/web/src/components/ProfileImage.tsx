// app/web/src/components/ProfileImage.tsx

import React from 'react'
import { View, Text, Image } from 'react-native'
import type { User, PartialUser } from '@iam/types'

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
	user?: Pick<User, 'username' | 'avatarUrl'> | Pick<PartialUser, 'username' | 'avatar'>
	size?: ProfileImageSize
}
  
export const ProfileImage: React.FC<ProfileImageProps> = ({ user, size = 'md' }) => {
	const imageSize = sizeMap[size]
	const fontSize = fontSizeMap[size]
	const initials = user?.username?.charAt(0).toUpperCase() || '?'
  
	const avatarUrl =
		user && 'avatarUrl' in user
			? user.avatarUrl
			: user && 'avatar' in user && user.avatar?.url
			? user.avatar.url
			: undefined
  
	if (avatarUrl) {
		return (
			<Image
				source={{ uri: avatarUrl }}
				style={{
					width: imageSize,
					height: imageSize,
					borderRadius: imageSize / 2,
					backgroundColor: '#ddd',
					alignSelf: 'flex-start',
				}}
			/>
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