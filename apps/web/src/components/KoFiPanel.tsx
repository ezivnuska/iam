import React, { useEffect } from 'react'
import { Platform, StyleSheet } from 'react-native'
import { WebView } from 'react-native-webview'
import { ModalContainer } from '@/components'
import { useModal, useSocket } from '@/hooks'

const KOFI_URL = 'https://ko-fi.com/iameric/?hidefeed=true&widget=true&embed=true&preview=true'

export default function KoFiPanel() {
	const { hideModal } = useModal()
	const { onDonation } = useSocket()

	useEffect(() => {
		onDonation((donation) => {
			console.log('💸 Ko-fi donation received:', donation)
			hideModal()
		})
	}, [])

	// const handleNavigationChange = (navState: any) => {
	// 	// Adjust this condition based on Ko-fi's behavior (inspect the URL after a donation)
	// 	if (
	// 		navState.url.includes('thank-you') ||
	// 		navState.url.includes('success') ||
	// 		navState.url.includes('ko-fi.com/iameric') // fallback
	// 	) {
	// 		console.log('Ko-fi donation likely completed')
	// 		hideModal()
	// 	}
	// }

	const renderContent = () => {
		if (Platform.OS === 'web') {
			return (
				<iframe
					src={KOFI_URL}
					style={{ ...styles.webview, border: 'none' }}
					title="Ko-fi Support Panel"
				/>
			)
		}

		return (
			<WebView
				source={{ uri: KOFI_URL }}
				style={styles.webview}
				javaScriptEnabled
				domStorageEnabled
				startInLoadingState
				// onNavigationStateChange={handleNavigationChange}
			/>
		)
	}

	return (
		<ModalContainer title="Donate">
			{renderContent()}
		</ModalContainer>
	)
}

const styles = StyleSheet.create({
	webview: {
		flex: 1,
		width: '100%',
		height: '100%',
	},
})
