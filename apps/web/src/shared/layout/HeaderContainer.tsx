// apps/web/src/shared/layout/HeaderContainer.tsx

import React, { ReactNode } from 'react'
import { Row } from '@shared/grid'
import { resolveResponsiveProp } from '@iam/theme'
import { useDeviceInfo } from '@shared/hooks'

export const HeaderContainer: React.FC<any> = ({ children }: { children: ReactNode }) => {
    let height = resolveResponsiveProp({ xs: 48, sm: 48, md: 48, lg: 60 })
    let bgColor = resolveResponsiveProp({ xs: 'red', sm: 'yellow', md: 'orange', lg: 'blue' })
    const { orientation } = useDeviceInfo()
    const isLandscape = orientation === 'landscape'
    if (!isLandscape) height += 12
	return (
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
            {children}
        </Row>
	)
}
