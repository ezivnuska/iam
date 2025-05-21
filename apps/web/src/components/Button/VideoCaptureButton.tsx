// apps/web/src/components/Button/VideoCaptureButton.tsx

import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

type VideoCaptureButtonProps = {
    capturing: boolean
    onPress: () => void
}

export const VideoCaptureButton: React.FC<VideoCaptureButtonProps> = ({ capturing, onPress }) => (
    <Pressable onPress={onPress}>
        {({ pressed }) => (
            <View style={[styles.captureButton, { opacity: pressed ? 0.5 : 1 }]}>
                <View style={[styles.captureButtonInner, { backgroundColor: capturing ? 'red' : 'white' }]} />
            </View>
        )}
    </Pressable>
)

const styles = StyleSheet.create({
	captureButton: {
		backgroundColor: 'transparent',
		borderWidth: 5,
		borderColor: 'white',
		width: 55,
		height: 55,
		borderRadius: 30,
		alignItems: 'center',
		justifyContent: 'center',
	},
	captureButtonInner: {
		width: 40,
		height: 40,
		borderRadius: 20,
	},
})
