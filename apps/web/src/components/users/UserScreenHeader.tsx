// apps/web/src/components/users/UserScreenHeader.tsx

import React from 'react'
import { useNavigationState } from '@react-navigation/native'
import { navigate } from '@/navigation'
import { Button, ScreenHeaderContainer, UserButton } from '@/components'

export const UserScreenHeader: React.FC<any> = () => {

    const route = useNavigationState((state) => {
        const userRoute = state.routes.find((r) => r.name === 'User')
        if (userRoute && 'state' in userRoute && userRoute.state) {
            const nestedState = userRoute.state
            return nestedState.routes[nestedState.index || 0]?.name || null
        }
        return null
    })

    const gotoImages = () => navigate('UserImages' as never)
    
	return (
        <ScreenHeaderContainer>
            <UserButton />
            <Button
                label='Images'
                onPress={gotoImages}
                variant={route === 'UserImages' ? 'transparent' : 'muted'}
                disabled={route === 'UserImages'}
            />
        </ScreenHeaderContainer>
	)
}
