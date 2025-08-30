// apps/web/src/shared/layout/HeaderNav.tsx

import React from 'react'
import { Button, IconButton } from '@shared/buttons'
import { FlexBox } from '@shared/grid'
import { useAuth } from '@features/auth'
import { useDeviceInfo, useTheme } from '@shared/hooks'
import { resolveResponsiveProp, Size } from '@iam/theme'
import { AuthNav } from '..'
import { useCurrentRoute } from '@shared/navigation'
import { navigate } from '@shared/navigation'

export const HeaderNav: React.FC = () => {
    const { isAuthenticated, isAuthInitialized, showAuthModal } = useAuth()
    const { isDark, toggleTheme } = useTheme()
    const { orientation } = useDeviceInfo()
    const currentRoute = useCurrentRoute()
    const isLandscape = orientation === 'landscape'
    const iconSize = resolveResponsiveProp({ xs: 22, sm: 22, md: 26, lg: 30 })
    const navSpacing = resolveResponsiveProp({ xs: Size.S, sm: Size.S, md: Size.S, lg: Size.M })
    const showLabel = resolveResponsiveProp({ xs: false, sm: false, md: false, lg: true })
    
    return (
        <FlexBox
            flex={1}
            direction={isLandscape ? 'column' : 'row-reverse'}
            align={isLandscape ? 'stretch' : 'center'}
            justify={isLandscape ? 'space-between' : 'flex-start'}
        >
            <FlexBox
                flex={1}
                direction={isLandscape ? 'column-reverse' : 'row'}
                spacing={navSpacing}
                justify={isLandscape ? 'space-between' : 'flex-end'}
                align={isLandscape ? 'stretch' : 'center'}
                paddingBottom={isLandscape ? Size.S : 0}
            >

                <FlexBox
                    flex={1}
                    spacing={navSpacing}
                    direction={isLandscape ? 'column' : 'row-reverse'}
                    justify={isLandscape ? 'space-between' : 'flex-start'}
                    align='center'
                    style={{
                        alignSelf: 'center',
                    }}
                >

                    <IconButton
                        label='Tiles'
                        iconName='grid'
                        onPress={() => navigate('Tiles')}
                        iconSize={iconSize - 2}
                        active={currentRoute === 'Tiles'}
                        showLabel={showLabel}
                    />

                    <IconButton
                        label='Theme'
                        iconName={isDark ? 'sunny' : 'moon'}
                        onPress={toggleTheme}
                        iconSize={iconSize - 2}
                        showLabel={showLabel}
                    />
                </FlexBox>

                {isAuthInitialized && (
                    <>
                        {isAuthenticated ? (
                            <AuthNav />
                        ) : (
                            <Button label='Sign In' onPress={() => showAuthModal(false)} compact />
                        )}
                    </>
                )}
            </FlexBox>
        </FlexBox>
    )
}
