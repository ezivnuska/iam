// apps/web/src/styles/shadows.ts

import { Platform } from 'react-native'

export const shadows = {
    card: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: Platform.OS === 'android' ? 3 : 0,
    },
    input: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: Platform.OS === 'android' ? 3 : 0,
    },
    modal: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: Platform.OS === 'android' ? 6 : 0,
    },
}