// apps/web/src/components/users/UsersScreenHeader.tsx

import React from 'react'
import { PageHeader, ScreenHeaderContainer } from '@/components'

export const UsersScreenHeader: React.FC<any> = () => {
	return (
        <ScreenHeaderContainer>
            <PageHeader title='Users' />
        </ScreenHeaderContainer>
	)
}
