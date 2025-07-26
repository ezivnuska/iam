// apps/web/src/shared/media/NativeCamera.tsx

import React, { useEffect, useRef, useState } from 'react'
import { CameraMode, CameraType, CameraView, useCameraPermissions } from 'expo-camera'
import { Pressable, StyleSheet, Text, View, Platform } from 'react-native'
import { Button, PhotoCaptureButton, VideoCaptureButton } from '@shared/buttons'
import Webcam from 'react-webcam'
import AntDesign from '@expo/vector-icons/AntDesign'
import Feather from '@expo/vector-icons/Feather'
import Ionicons from '@expo/vector-icons/Ionicons'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'

type NativeCameraProps = {
	onCapture: (uri: string) => void
	onCancel: () => void
}

const NativeCamera: React.FC<NativeCameraProps> = ({ onCapture, onCancel }) => {
	const [permission, requestPermission] = useCameraPermissions()
	const cameraRef = useRef<CameraView>(null)
	const [mode, setMode] = useState<CameraMode>('picture')
	const [facing, setFacing] = useState<CameraType>('back')
	const [recording, setRecording] = useState(false)

	const takePicture = async () => {	
        const photo = await cameraRef.current?.takePictureAsync()
        if (!photo) {
            console.log('Camera Error: no photo taken.')
            return
        }
        onCapture(photo.uri)
	}

	const recordVideo = async () => {
		if (recording) {
			setRecording(false)
			cameraRef.current?.stopRecording()
			return
		}
		setRecording(true)
		const video = await cameraRef.current?.recordAsync()
		console.log({ video })
	}

	const toggleMode = () => {
		setMode((prev) => (prev === 'picture' ? 'video' : 'picture'))
	}

	const toggleFacing = () => {
		setFacing((prev) => (prev === 'back' ? 'front' : 'back'))
	}

    const renderCaptureButton = () => mode === 'picture'
        ? <PhotoCaptureButton onPress={takePicture} />
        : <VideoCaptureButton onPress={recordVideo} capturing={recording} />
    
	const renderCamera = () => (
        <View style={styles.camera}>
            <CameraView
                style={[StyleSheet.absoluteFill, styles.camera]}
                ref={cameraRef}
                mode={mode}
                facing={facing}
                mute={false}
                responsiveOrientationWhenOrientationLocked
            />
        </View>
    )

	if (Platform.OS !== 'web') {
		if (!permission) {
			return null
		} else if (!permission.granted) {
			return (
				<View style={styles.container}>
					<Text style={{ textAlign: 'center' }}>
						We need your permission to use the camera
					</Text>
					<Button onPress={requestPermission} label='Grant permission' />
				</View>
			)
		}
	}

	return (
        <View style={[StyleSheet.absoluteFill, styles.container]}>
            {renderCamera()}
            <Pressable onPress={onCancel} style={styles.closeButton}>
                <Ionicons name='close-sharp' size={28} color='white' />
            </Pressable>
            <View style={styles.shutterContainer}>
                <Pressable onPress={toggleMode}>
                    {
                        mode === 'picture'
                        ? <AntDesign name='picture' size={32} color='white' />
                        : <Feather name='video' size={32} color='white' />
                    }
                </Pressable>
                {renderCaptureButton()}
                <Pressable onPress={toggleFacing}>
                    <FontAwesome6 name='rotate-left' size={32} color='white' />
                </Pressable>
            </View>
        </View>
    )
}

export default NativeCamera

const styles = StyleSheet.create({
	container: {
		flex: 1,
        width: '100%',
		backgroundColor: '#000',
		alignItems: 'center',
		justifyContent: 'center',
        position: 'relative',
	},
	camera: {
        zIndex: 10,
	},
	closeButton: {
		position: 'absolute',
		top: 16,
		left: 16,
        zIndex: 20,
	},
	shutterContainer: {
		position: 'absolute',
		bottom: 16,
		left: 0,
		width: '100%',
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 30,
        zIndex: 30,
	},
})
