// apps/web/src/shared/layout/ScreenHeaderContainer.tsx

import React, { ReactNode } from 'react'
import { Row } from '@shared/grid'
import { Size } from '@iam/theme'

export const ScreenHeaderContainer: React.FC<any> = ({ children }: { children: ReactNode }) => {

	return (
        <Row
            flex={1}
            spacing={Size.M}
            align='center'
            wrap={false}
            paddingVertical={Size.XS}
        >
            {children}
        </Row>
	)
}
