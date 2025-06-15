// apps/web/src/components/KoFiPanel.tsx

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
			console.log('Ko-fi donation received:', donation)
			hideModal()
		})
	}, [])

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
