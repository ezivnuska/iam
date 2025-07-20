// apps/web/src/components/profile/ProfileViewHeader.tsx

import React from 'react'
import { View } from 'react-native'
import { useNavigationState } from '@react-navigation/native'
import { useTheme } from '@/hooks'
import { navigate } from '@/navigation'
import { Button } from '@/components'

export const ProfileViewHeader: React.FC<any> = () => {
    const { theme } = useTheme()

    const route = useNavigationState((state) => {
        const profileRoute = state.routes.find((r) => r.name === 'Profile')
        if (profileRoute && 'state' in profileRoute && profileRoute.state) {
            const nestedState = profileRoute.state
            return nestedState.routes[nestedState.index || 0]?.name || null
        }
        return null
    })
    
    const gotoImages = () => navigate('Images' as never)

    const renderContent = () => {
        switch (route) {
            case 'Main':
                return (
                    <Button
                        label='Images'
                        onPress={gotoImages}
                        variant='muted'
                    />
                )
            default: return null
        }
    }
	return (
        <View style={{ backgroundColor: theme.colors.background }}>
            {renderContent()}
        </View>
	)
}
