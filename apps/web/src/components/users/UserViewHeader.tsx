// apps/web/src/components/users/UserViewHeader.tsx

import React from 'react'
import { View } from 'react-native'
import { useNavigationState } from '@react-navigation/native'
import { useAuth, useTheme } from '@/hooks'
import { navigate } from '@/navigation'
import { Button, ImageGalleryHeader, UserProfileHeader, useUserProfile } from '@/components'

export const UserViewHeader: React.FC<any> = () => {
    const { user } = useAuth()
    const { theme } = useTheme()
    const userToDisplay = useUserProfile()
    const isOwner = user?.id === userToDisplay?.id

    const route = useNavigationState((state) => {
        const userRoute = state.routes.find((r) => r.name === 'User')
        if (userRoute && 'state' in userRoute && userRoute.state) {
            const nestedState = userRoute.state
            return nestedState.routes[nestedState.index || 0]?.name || null
        }
        return null
    })

    const gotoImages = () => navigate('UserImages' as never)

    const renderContent = () => {
        switch (route) {
            case 'UserProfile':
                return (
                    <Button
                        label='Images'
                        onPress={gotoImages}
                        variant='muted'
                    />
                )
            case 'UserImages': return <ImageGalleryHeader owner={isOwner} />
            default: return <View style={{ backgroundColor: 'red', height: 100, width: 100 }} />
        }
    }
	return (
        <View style={{ backgroundColor: theme.colors.background }}>
            {renderContent()}
        </View>
	)
}
