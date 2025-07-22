// apps/web/src/components/layout/ScreenHeaderContainer.tsx

import React, { ReactNode } from 'react'
import { Row } from '@/components'
import { Size } from '@iam/theme'

export const ScreenHeaderContainer: React.FC<any> = ({ children }: { children: ReactNode }) => {

	return (
        <Row
            flex={1}
            spacing={Size.M}
            align='center'
            wrap={false}
        >
            {children}
        </Row>
	)
}
