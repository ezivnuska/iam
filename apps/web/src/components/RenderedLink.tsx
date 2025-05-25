// apps/web/src/components/RenderedLink.tsx

import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Column, Row } from './Layout'
import { scrape } from '@services'
import { shadows, Size } from '@/styles'
import { format } from 'date-fns'

type RenderedLinkProps = {
	url: string
}

type ScraperProps = {
	title?: string
	author?: string
	date?: string
	description?: string
	image?: string
}

export const RenderedLink: React.FC<RenderedLinkProps> = ({ url }) => {
	const [data, setData] = useState<ScraperProps | null>(null)
	const [aspectRatio, setAspectRatio] = useState<number | undefined>(1)

	useEffect(() => {
		let timeoutId: NodeJS.Timeout

		const init = async () => {
			console.log('RenderedLink mounted with:', url)
			const cacheKey = `link-metadata:${url}`
			try {
				// Try loading from AsyncStorage
				const cached = await AsyncStorage.getItem(cacheKey)
				if (cached) {
					const parsed = JSON.parse(cached)
					setData(parsed)
					if (parsed.image) {
						Image.getSize(
							parsed.image,
							(w, h) => setAspectRatio(w / h),
							() => {}
						)
					}
					return
				}

				// Debounce: wait 300ms before fetching
				timeoutId = setTimeout(async () => {
					const { response } = await scrape(url)
					if (response) {
						setData(response)
						if (response.image) {
							Image.getSize(
								response.image,
								(w, h) => setAspectRatio(w / h),
								() => {}
							)
						}
						await AsyncStorage.setItem(cacheKey, JSON.stringify(response))
					}
				}, 300)
			} catch (error) {
				console.warn('Error fetching or caching metadata:', error)
				setData({ title: 'Error loading preview', description: String(error) })
			}
		}

		init()

		// Cleanup debounce
		return () => clearTimeout(timeoutId)
	}, [url])

	const openExternalUrl = () => {
		Linking.openURL(url).catch(err => console.error('Error loading page', err))
	}

	return data ? (
		<TouchableOpacity onPress={openExternalUrl}>
			<Column spacing={16}>
				{data.image && (
					<View style={[shadows.image, styles.imageContainer]}>
						<Image
							source={{ uri: data.image }}
							style={{ width: '100%', maxWidth: 500, aspectRatio }}
							resizeMode='contain'
						/>
					</View>
				)}
				<Column spacing={Size.XS} paddingHorizontal={Size.M}>
					{data.title && <Text style={styles.heading}>{data.title}</Text>}
					<Row flex={1} spacing={16}>
						{data.author && <Text style={styles.author}>{data.author}</Text>}
						{data.date && <Text style={styles.date}>{format(new Date(data.date), 'MMM ddd yyyy')}</Text>}
					</Row>
				</Column>
                <Text style={styles.description}>{data.description}</Text>
			</Column>
		</TouchableOpacity>
	) : (
		<ActivityIndicator size='large' />
	)
}

const styles = StyleSheet.create({
    imageContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
    },
	heading: {
		fontSize: 16,
		fontWeight: '700',
        lineHeight: 20,
	},
	author: {
		fontSize: 12,
	},
	date: {
		fontSize: 12,
	},
	description: {
		fontSize: 14,
        paddingHorizontal: Size.M,
	},
	link: {
		color: '#007aff',
		textDecorationLine: 'underline',
	}
})
