// apps/web/src/shared/layout/Header.tsx

import React from 'react'
import { Brand, HeaderNav } from '@shared/layout'
import { FlexBox, Row } from '@shared/grid'
import { useDeviceInfo } from '@shared/hooks'
import { resolveResponsiveProp } from '@iam/theme'
import { User } from '@iam/types'

type HeaderProps = {
    user?: User | undefined
}
export const Header: React.FC<HeaderProps> = ({ user }) => {
    let height = resolveResponsiveProp({ xs: 48, sm: 48, md: 48, lg: 60 })
    const { orientation } = useDeviceInfo()
    const isLandscape = orientation === 'landscape'
    if (!isLandscape) height += 12

    return (
        <FlexBox
            direction={isLandscape ? 'column' : 'row'}
            justify={isLandscape ? 'flex-start' : 'space-between'}
            align='center'
            spacing={12}
            paddingHorizontal={12}
            style={{ backgroundColor: 'red' }}
        >
            <Row
                align='center'
                wrap={false}
                spacing={12}
                style={{
                    height,
                    alignContent: 'center',
                    width: '100%',
                    // backgroundColor: bgColor,
                }}
            >
                <Brand />

                {!isLandscape && <HeaderNav user={user} />}
            </Row>

            {isLandscape && <HeaderNav user={user} />}
        </FlexBox>
    )
}
