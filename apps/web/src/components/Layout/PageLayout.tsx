import React from 'react'
import {
	StyleSheet,
	Keyboard,
	TouchableWithoutFeedback,
	Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Header, Footer } from '.'
import Column from '@/components/Layout/Column'
import { MAX_WIDTH } from './constants'

interface PageLayoutProps {
	children: React.ReactNode
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
	return (
		<SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
				<Column flex={1}>
					<Header />

					<KeyboardAwareScrollView
						style={styles.scroll}
						contentContainerStyle={styles.scrollContent}
						extraScrollHeight={Platform.OS === 'ios' ? 80 : 100}
						enableOnAndroid
						keyboardShouldPersistTaps='handled'
						showsVerticalScrollIndicator={false}
					>
						<Column flex={1} style={styles.content}>
							{children}
						</Column>
					</KeyboardAwareScrollView>

					<Footer />
				</Column>
			</TouchableWithoutFeedback>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	scroll: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
	},
	content: {
		width: '100%',
		maxWidth: MAX_WIDTH,
		alignSelf: 'center',
		paddingHorizontal: 16,
	},
})