// apps/web/src/shared/layout/Header.tsx

import React from 'react'
import { Brand, HeaderContainer, HeaderNav } from '@shared/layout'
import { FlexBox } from '@shared/grid'
import { useDeviceInfo } from '@shared/hooks'

export const Header: React.FC = () => {
    const { orientation } = useDeviceInfo()
    const isLandscape = orientation === 'landscape'

    return (
        <FlexBox
            direction={isLandscape ? 'column' : 'row'}
            justify={isLandscape ? 'flex-start' : 'space-between'}
            align='center'
            spacing={12}
            paddingHorizontal={12}
        >
            <HeaderContainer>
                <Brand />

                {!isLandscape && <HeaderNav />}
            </HeaderContainer>

            {isLandscape && <HeaderNav />}
        </FlexBox>
    )
}
