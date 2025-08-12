// apps/web/src/shared/layout/HeaderNav.tsx

import React from 'react'
import { Button, IconButton } from '@shared/buttons'
import { FlexBox } from '@shared/grid'
import { AuthModal } from '@shared/modals'
import { useAuth, useDeviceInfo, useModal, useTheme } from '@shared/hooks'
import { resolveResponsiveProp, Size } from '@iam/theme'
import { AuthNav } from '..'
import { navigate } from '@shared/navigation'

export const HeaderNav: React.FC = () => {
    const { isAuthenticated, isAuthInitialized, user } = useAuth()
    const { showModal } = useModal()
    const { isDark, toggleTheme } = useTheme()
    const { orientation } = useDeviceInfo()
    const isLandscape = orientation === 'landscape'
    const iconSize = resolveResponsiveProp({ xs: 24, sm: 24, md: 32, lg: 32 })
    const navSpacing = resolveResponsiveProp({ xs: Size.S, sm: Size.S, md: Size.S, lg: Size.M })
    
    const showSigninModal = () => showModal(<AuthModal />, true)

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
                    style={{
                        alignSelf: 'center',
                    }}
                >
                    <IconButton
                        iconName='grid'
                        onPress={() => navigate('Tiles')}
                        iconSize={iconSize - 2}
                        // active={currentRoute === 'Tiles'}
                    />
                    <IconButton
                        iconName={isDark ? 'sunny' : 'moon'}
                        onPress={toggleTheme}
                        iconSize={iconSize - 2}
                    />
                </FlexBox>

                {isAuthInitialized && (
                    <>
                        {isAuthenticated ? (
                            <AuthNav />
                        ) : (
                            <Button label='Sign In' onPress={showSigninModal} />
                        )}
                    </>
                )}
            </FlexBox>
        </FlexBox>
    )
}
