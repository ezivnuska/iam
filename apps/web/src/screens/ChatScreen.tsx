// apps/web/src/screens/ChatScreen.tsx

import React from 'react'
import { ChatViewHeader, ScreenContainer } from '@/components'
import { ChatNavigator } from '@/navigation'

export const ChatScreen = () => {
	return (
        <ScreenContainer
            header={ChatViewHeader}
            screen={ChatNavigator}
        />
	)
}
