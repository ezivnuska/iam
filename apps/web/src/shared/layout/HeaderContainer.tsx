// apps/web/src/shared/layout/HeaderContainer.tsx

import React, { ReactNode } from 'react'
import { Row } from '@shared/grid'
import { resolveResponsiveProp } from '@iam/theme'
import { useDeviceInfo } from '@shared/hooks'

export const HeaderContainer: React.FC<any> = ({ children }: { children: ReactNode }) => {
    let height = resolveResponsiveProp({ xs: 26, sm: 34, md: 40, lg: 46 })
    const { orientation } = useDeviceInfo()
    const isLandscape = orientation === 'landscape'
    if (!isLandscape) height += 10
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
