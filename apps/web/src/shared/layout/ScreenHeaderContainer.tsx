// apps/web/src/shared/layout/ScreenHeaderContainer.tsx

import React, { ReactNode } from 'react'
import { HeaderContainer } from '..'

export const ScreenHeaderContainer: React.FC<any> = ({ children }: { children: ReactNode }) => {

	return (
        <HeaderContainer>
            {children}
        </HeaderContainer>
	)
}
