// apps/web/src/shared/layout/HeaderContainer.tsx

import React, { ReactNode } from 'react'
import { Row } from '@shared/grid'
import { resolveResponsiveProp } from '@iam/theme'
import { useDeviceInfo } from '@shared/hooks'

export const HeaderContainer: React.FC<any> = ({ children }: { children: ReactNode }) => {
    let height = resolveResponsiveProp({ xs: 40, sm: 40, md: 50, lg: 50 })
    const { orientation } = useDeviceInfo()
    const isLandscape = orientation === 'landscape'
    if (!isLandscape) height += 12
	return (
        <Row
            align='center'
            wrap={false}
            style={{
                height,
                alignContent: 'center',
                width: '100%',
            }}
        >
            {children}
        </Row>
	)
}
