import { useEffect } from 'react'
import { Alert } from 'react-native'
// import { useNavigation } from 'expo-router'
import { useNavigation } from '@react-navigation/native'

export const usePreventBack = (customMessage: string, yesAction: () => {}) => {
    const navigation = useNavigation()

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => null,
            gestureEnabled: false,
        })

        const beforeRemoveListener = navigation.addListener('beforeRemove', (e: any) => {
            // Check if the action is a "go back" action
            if (e.data.action.type === 'GO_BACK' || e.data.action.type === 'POP') {
                e.preventDefault()
                Alert.alert(
                    'Hold on!',
                    customMessage || 'Are you sure you want to leave?',
                    [
                        { text: 'Cancel', style: 'cancel', onPress: () => {} },
                        {
                            text: 'Yes',
                            style: 'destructive',
                            onPress: () => {
                                if (yesAction) yesAction() // Call custom Yes action
                                navigation.dispatch(e.data.action)
                            },
                        },
                    ]
                )
            }
        })

        navigation.getParent()?.setOptions({ gestureEnabled: false })

        return () => {
            beforeRemoveListener()
            navigation.getParent()?.setOptions({ gestureEnabled: true })
            navigation.setOptions({
                gestureEnabled: true,
            })
        }
    }, [customMessage, yesAction, navigation])
}
