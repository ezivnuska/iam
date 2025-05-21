// apps/web/src/components/Webcam.tsx

import React, { useEffect, useRef, useState } from 'react'
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
import Ionicons from '@expo/vector-icons/Ionicons'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'

type WebCameraProps = {
	onCapture: (uri: string) => void
	onCancel: () => void
}

enum CameraMode {
    PHOTO = 'picture',
    VIDEO = 'video',
}

enum CameraFacing {
    FRONT = 'environment',
    BACK = 'user',
}

const WebCamera: React.FC<WebCameraProps> = ({ onCapture, onCancel }) => {
	const webcamRef = useRef<Webcam>(null)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
	const [mode, setMode] = useState<CameraMode>(CameraMode.PHOTO)
	const [cameraFacing, setCameraFacing] = useState<CameraFacing>(CameraFacing.FRONT)
    const [capturing, setCapturing] = useState(false)
    const [recordedChunks, setRecordedChunks] = useState<Blob[]>([])

    const [devices, setDevices] = useState<MediaDeviceInfo[]>([])

    const handleDevices = React.useCallback(
        (mediaDevices: MediaDeviceInfo[]) =>
            setDevices(mediaDevices.filter(({ kind }) => kind === 'videoinput')),
        [setDevices]
    )    
    
    useEffect(
        () => {
            navigator.mediaDevices.enumerateDevices().then(handleDevices);
        },
        [handleDevices]
    )

    useEffect(() => {
        console.log('devices', devices)
    }, [devices])
    
    const handleDataAvailable = React.useCallback(
        ({ data }: BlobEvent) => {
            if (data.size > 0) {
                setRecordedChunks((prev) => prev.concat(data))
            }
        },
        [setRecordedChunks]
    )

    const handleStartCaptureClick = React.useCallback(() => {
        const stream = webcamRef.current?.stream;
        if (!stream) {
            console.error('No webcam stream available')
            return;
        }
    
        setCapturing(true)
    
        mediaRecorderRef.current = new MediaRecorder(stream, {
            mimeType: 'video/webm'
        })
    
        mediaRecorderRef.current.addEventListener(
            'dataavailable',
            handleDataAvailable
        )
    
        mediaRecorderRef.current.start()
    }, [webcamRef, setCapturing, mediaRecorderRef, handleDataAvailable])
    
    const handleStopCaptureClick = React.useCallback(() => {
        if (!mediaRecorderRef.current) return
        mediaRecorderRef.current.stop()
        setCapturing(false)
    }, [mediaRecorderRef, webcamRef, setCapturing])
    
    const handleDownload = React.useCallback(() => {
        if (recordedChunks.length) {
            const blob = new Blob(recordedChunks, {
                type: 'video/webm'
            })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            document.body.appendChild(a)
            a.style.display = 'none'
            a.href = url
            a.download = 'react-webcam-stream-capture.webm'
            a.click()
            window.URL.revokeObjectURL(url)
            setRecordedChunks([])
        }
    }, [recordedChunks])

	const takePicture = async () => {
        const imageSrc = webcamRef.current?.getScreenshot()
        
        if (!imageSrc) {
            console.log('Webcam error: no image captured')
            return
        }
        onCapture(imageSrc)
	}

	const toggleMode = () => {
		setMode((prev) => (prev === CameraMode.PHOTO ? CameraMode.VIDEO : CameraMode.PHOTO))
	}

	const toggleFacing = () => {
		setCameraFacing((prev) => (prev === CameraFacing.BACK ? CameraFacing.FRONT : CameraFacing.BACK))
	}

    const renderCaptureButton = () => mode === CameraMode.PHOTO
        ? <PhotoCaptureButton onPress={takePicture} />
        : <VideoCaptureButton onPress={capturing ? handleStopCaptureClick : handleStartCaptureClick} capturing={capturing} />

	const renderCamera = () => (
        <View style={styles.camera}>
            <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat='image/jpeg'
                videoConstraints={{ facingMode: { ideal: cameraFacing } }}
                style={{ width: '100%', height: '100%' }}
            />
        </View>
    )
    
	return (
        <View style={[StyleSheet.absoluteFill, styles.container]}>
            {renderCamera()}
            <Pressable onPress={onCancel} style={styles.closeButton}>
                <Ionicons name='close-sharp' size={28} color='white' />
            </Pressable>
            <View style={styles.shutterContainer}>
                <Pressable onPress={toggleMode}>
                    {mode === 'picture' ? (
                        <AntDesign name='picture' size={32} color='white' />
                    ) : (
                        <Feather name='video' size={32} color='white' />
                    )}
                </Pressable>
                {renderCaptureButton()}
                <Pressable onPress={toggleFacing} disabled={devices.length > 1} style={{ opacity: devices.length > 1 ? 1 : 0}}>
                    <FontAwesome6 name='rotate-left' size={32} color='#fff' />
                </Pressable>
                {recordedChunks.length > 0 && (
                    <Button onPress={handleDownload} label='Download' />
                )}
            </View>
        </View>)
}

type PhotoCaptureButtonProps = {
    onPress: () => void
}
const PhotoCaptureButton: React.FC<PhotoCaptureButtonProps> = ({ onPress }) => (
    <Pressable onPress={onPress}>
        {({ pressed }) => (
            <View style={[styles.shutterBtn, { opacity: pressed ? 0.5 : 1 }]}>
                <View style={[styles.shutterBtnInner, { backgroundColor: 'white' }]} />
            </View>
        )}
    </Pressable>
)

type VideoCaptureButtonProps = {
    capturing: boolean
    onPress: () => void
}
const VideoCaptureButton: React.FC<VideoCaptureButtonProps> = ({ capturing, onPress }) => (
    <Pressable onPress={onPress}>
        {({ pressed }) => (
            <View style={[styles.shutterBtn, { opacity: pressed ? 0.5 : 1 }]}>
                <View style={[styles.shutterBtnInner, { backgroundColor: capturing ? 'red' : 'white' }]} />
            </View>
        )}
    </Pressable>
)

export default WebCamera

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#000',
		alignItems: 'center',
		justifyContent: 'center',
        position: 'relative',
	},
	camera: {
        zIndex: 10,
		// width: 300,
		// height: 400,
		// borderRadius: 8,
		// overflow: 'hidden',
		// position: 'relative',
	},
	closeButton: {
		position: 'absolute',
		top: 16,
		right: 16,
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
	shutterBtn: {
		backgroundColor: 'transparent',
		borderWidth: 5,
		borderColor: 'white',
		width: 55,
		height: 55,
		borderRadius: 30,
		alignItems: 'center',
		justifyContent: 'center',
	},
	shutterBtnInner: {
		width: 40,
		height: 40,
		borderRadius: 20,
	},
})
