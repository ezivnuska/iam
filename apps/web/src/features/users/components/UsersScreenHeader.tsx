// apps/web/src/components/users/UsersScreenHeader.tsx

import React from 'react'
import { PageHeader } from '@shared/ui'
import { ScreenHeaderContainer } from '@shared/layout'

export const UsersScreenHeader: React.FC<any> = () => {
	return (
        <ScreenHeaderContainer>
            <PageHeader title='Users' />
        </ScreenHeaderContainer>
	)
}
