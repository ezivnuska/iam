// apps/web/src/components/layout/ScreenHeaderContainer.tsx

import React, { ReactNode } from 'react'
import { Row } from '@/components'
import { Size } from '@iam/theme'
import { useDeviceInfo } from '@/hooks'

export const ScreenHeaderContainer: React.FC<any> = ({ children }: { children: ReactNode }) => {

    const { orientation } = useDeviceInfo()

    const isLandscape = orientation === 'landscape'

	return (
        <Row
            spacing={Size.M}
            align='center'
            paddingTop={isLandscape ? Size.M : 0}
        >
            {children}
        </Row>
	)
}
