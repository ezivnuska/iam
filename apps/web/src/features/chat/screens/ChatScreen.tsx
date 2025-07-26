// apps/web/src/features/screens/ChatScreen.tsx

import React from 'react'
import { ChatViewHeader } from '../components'
import { ScreenContainer } from '@shared/layout'
import { ChatNavigator } from '../'

export const ChatScreen = () => {
	return (
        <ScreenContainer
            header={ChatViewHeader}
            screen={ChatNavigator}
        />
	)
}
