// apps/web/src/components/users/UserProfileHeader.tsx

import React from 'react'
import { Text } from 'react-native'
import { useTheme } from '@shared/hooks'

export const UserProfileHeader = () => {
    const { theme } = useTheme()
	return <Text style={{ fontSize: 24, fontWeight: '600', color: theme.colors.text }}>Profile</Text>
}
