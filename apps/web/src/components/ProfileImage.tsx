// app/web/src/components/ProfileImage.tsx

import React from 'react'
import { Text, Pressable, StyleSheet } from 'react-native'
import AutoSizeImage from './AutoSizeImage'
import type { Image } from '@iam/types'

export type ProfileImageSize = 'xs' | 'sm' | 'md' | 'lg'

const sizeMap: Record<ProfileImageSize, number> = {
	xs: 24,
	sm: 32,
	md: 40,
	lg: 48,
}

const fontSizeMap: Record<ProfileImageSize, number> = {
	xs: 14,
	sm: 12,
	md: 26,
	lg: 32,
}

interface ProfileImageProps {
	user?: {
		username?: string
		avatar?: Image
	}
	size?: ProfileImageSize
    onPress?: () => void
}

export const ProfileImage: React.FC<ProfileImageProps> = ({ user, onPress = null, size = 'md' }) => {
	const imageSize = sizeMap[size]
	const fontSize = fontSizeMap[size]
	const initials = user?.username?.charAt(0).toUpperCase() || '?'
    const avatar = user?.avatar

    const renderAvatar = () =>
        avatar ? (
            <AutoSizeImage
                image={avatar}
                style={{ width: imageSize, height: imageSize }}
                forceSquare
            />
        ) : <Text style={{ fontSize, color: '#555', fontWeight: 'bold' }}>{initials}</Text>
    
    return (
        <Pressable
            onPress={onPress}
            disabled={!onPress}
            style={[
                styles.container, {
                    width: imageSize,
                    height: imageSize,
                    borderRadius: imageSize / 2,
                    borderWidth: 1,
                }
            ]}
        >
            {renderAvatar()}
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
})