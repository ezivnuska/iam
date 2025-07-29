// app/web/src/shared/ui/Avatar.tsx

import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { AutoSizeImage } from '@shared/ui'
import type { Image } from '@iam/types'

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg'

const sizeMap: Record<AvatarSize, number> = {
	xs: 20,
	sm: 26,
	md: 32,
	lg: 36,
}

const fontSizeMap: Record<AvatarSize, number> = {
	xs: 16,
	sm: 20,
	md: 26,
	lg: 32,
}

interface AvatarProps {
	user?: {
		username: string
		avatar?: Image
	}
	size?: AvatarSize
    onPress?: () => void
}

export const Avatar: React.FC<AvatarProps> = ({
    user,
    size = 'md',
	onPress = null,
}) => {
	const imageSize = sizeMap[size]
	const fontSize = fontSizeMap[size]
	const initials = user?.username?.charAt(0).toUpperCase() || '?'
    const avatar = user?.avatar
    
    return (
        <Pressable
            onPress={onPress}
            disabled={!onPress}
            style={[
                styles.container,
				{
                    width: imageSize,
                    height: imageSize,
                    borderRadius: imageSize / 2,
                    borderWidth: 1,
                },
            ]}
        >
            {avatar
				? (
					<AutoSizeImage
						image={avatar}
                        style={{ width: imageSize, height: imageSize }}
						forceSquare
					/>
				)
				: (
                    <View style={{ width: imageSize, height: imageSize }}>
                        <Text style={{ lineHeight: imageSize, fontSize, color: '#555', fontWeight: 'bold', marginHorizontal: 'auto' }}>{initials}</Text>
                    </View>
                )
			}
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