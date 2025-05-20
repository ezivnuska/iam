// apps/web/src/components/CameraCapture.tsx

import React, { useEffect, useRef, useState } from 'react'
import {
	CameraMode,
	CameraType,
	CameraView,
	useCameraPermissions,
} from 'expo-camera'
import {
	Image,
	Pressable,
	StyleSheet,
	Text,
	View,
	Platform,
} from 'react-native'
import { Button } from '@/components'
import Webcam from 'react-webcam'
import AntDesign from '@expo/vector-icons/AntDesign'
import Feather from '@expo/vector-icons/Feather'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'

type CameraCaptureProps = {
	onCapture: (uri: string) => void
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture }) => {
	const [permission, requestPermission] = useCameraPermissions()
	const cameraRef = useRef<CameraView>(null)
	const webcamRef = useRef<Webcam>(null)
	const [uri, setUri] = useState<string | null>(null)
	const [mode, setMode] = useState<CameraMode>('picture')
	const [facing, setFacing] = useState<CameraType>('back')
	const [recording, setRecording] = useState(false)

	const takePicture = async () => {
		if (Platform.OS === 'web') {
			const imageSrc = webcamRef.current?.getScreenshot()
			
			if (!imageSrc) {
				console.log('Webcam error: no image captured')
				return
			}
			setUri(imageSrc)
			onCapture(imageSrc)
		} else {
			const photo = await cameraRef.current?.takePictureAsync()
			if (!photo) {
				console.log('Camera Error: no photo taken.')
				return
			}
			setUri(photo.uri)
		}		
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

	const renderPicture = () => (
		<View>
			{uri && (
				<Image source={{ uri }} style={{ width: 300, aspectRatio: 1 }} />
			)}
			<Button onPress={() => setUri(null)} label='Camera' />
			{uri && <Button onPress={() => onCapture(uri)} label='Use Image' />}
		</View>
	)

	const renderCamera = () => {
		if (Platform.OS === 'web') {
			return (
				<View style={styles.camera}>
					<Webcam
						ref={webcamRef}
						audio={false}
						screenshotFormat='image/jpeg'
						videoConstraints={{
							facingMode: { ideal: 'back' },
						}}
						style={{ width: '100%', height: '100%' }}
					/>
					<View style={styles.shutterContainer}>
						<Pressable onPress={toggleMode}>
							{mode === 'picture' ? (
								<AntDesign name='picture' size={32} color='white' />
							) : (
								<Feather name='video' size={32} color='white' />
							)}
						</Pressable>
						<Pressable onPress={takePicture}>
							{({ pressed }) => (
								<View
									style={[
										styles.shutterBtn,
										{
											opacity: pressed ? 0.5 : 1,
										},
									]}
								>
									<View
										style={[
											styles.shutterBtnInner,
											{
												backgroundColor: mode === 'picture' ? 'white' : 'red',
											},
										]}
									/>
								</View>
							)}
						</Pressable>
						<Pressable onPress={toggleFacing}>
							<FontAwesome6 name='rotate-left' size={32} color='white' />
						</Pressable>
					</View>
				</View>
			)
		}

		// Native Expo CameraView
		return (
			<CameraView
				style={styles.camera}
				ref={cameraRef}
				mode={mode}
				facing={facing}
				mute={false}
				responsiveOrientationWhenOrientationLocked
			>
				<View style={styles.shutterContainer}>
					<Pressable onPress={toggleMode}>
						{mode === 'picture' ? (
							<AntDesign name='picture' size={32} color='white' />
						) : (
							<Feather name='video' size={32} color='white' />
						)}
					</Pressable>
					<Pressable onPress={mode === 'picture' ? takePicture : recordVideo}>
						{({ pressed }) => (
							<View
								style={[
									styles.shutterBtn,
									{
										opacity: pressed ? 0.5 : 1,
									},
								]}
							>
								<View
									style={[
										styles.shutterBtnInner,
										{
											backgroundColor: mode === 'picture' ? 'white' : 'red',
										},
									]}
								/>
							</View>
						)}
					</Pressable>
					<Pressable onPress={toggleFacing}>
						<FontAwesome6 name='rotate-left' size={32} color='white' />
					</Pressable>
				</View>
			</CameraView>
		)
	}

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

	return <View style={styles.container}>{uri ? renderPicture() : renderCamera()}</View>
}

export default CameraCapture

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#000',
		alignItems: 'center',
		justifyContent: 'center',
	},
	camera: {
		width: 300,
		height: 400,
		borderRadius: 8,
		overflow: 'hidden',
		position: 'relative',
	},
	shutterContainer: {
		position: 'absolute',
		bottom: 44,
		left: 0,
		width: '100%',
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 30,
	},
	shutterBtn: {
		backgroundColor: 'transparent',
		borderWidth: 5,
		borderColor: 'white',
		width: 85,
		height: 85,
		borderRadius: 45,
		alignItems: 'center',
		justifyContent: 'center',
	},
	shutterBtnInner: {
		width: 70,
		height: 70,
		borderRadius: 50,
	},
})
