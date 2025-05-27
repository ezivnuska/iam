// apps/web/src/components/LinkPreview.tsx

import React, { useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, Dimensions, Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Column, Row } from './Layout'
import { scrape } from '@services'
import { resolveResponsiveProp, Size } from '@/styles'
import { format } from 'date-fns'

type LinkPreviewProps = {
	url: string
}

type ScraperProps = {
	title?: string
	description?: string
	image?: string
}

const memoryCache = new Map<string, ScraperProps>()

export const LinkPreview: React.FC<LinkPreviewProps> = ({ url }) => {
	const [data, setData] = useState<ScraperProps | null>(null)
	const [aspectRatio, setAspectRatio] = useState<number | undefined>(1)
    const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width)
    const maxWidth = useMemo(
        () => resolveResponsiveProp({ xs: 500, sm: 500, md: 500 - Size.M * 2, lg: 500 - Size.M * 2 }),
        [windowWidth]
    )

    useEffect(() => {
        const onChange = ({ window }: { window: { width: number } }) => setWindowWidth(window.width)
        const subscription = Dimensions.addEventListener('change', onChange)
        return () => subscription.remove?.()
    }, [])

	useEffect(() => {
		let timeoutId: NodeJS.Timeout

		const init = async () => {
			const cacheKey = `link-metadata:${url}`

            if (memoryCache.has(url)) {
                setData(memoryCache.get(url)!)
                return
            }
        
			try {
				// Try loading from AsyncStorage
				const cached = await AsyncStorage.getItem(cacheKey)
				if (cached) {
					const parsed = JSON.parse(cached)
					setData(parsed)
                    memoryCache.set(url, parsed)
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
                        memoryCache.set(url, response)
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
                    <Image
                        source={{ uri: data.image }}
                        style={{ width: '100%', maxWidth, aspectRatio, marginHorizontal: 'auto' }}
                        resizeMode='contain'
                    />
				)}
				<Column spacing={Size.XS} paddingHorizontal={Size.M}>
					{data.title && <Text style={styles.heading}>{data.title}</Text>}
                    <Text style={styles.description}>{data.description}</Text>
				</Column>
			</Column>
		</TouchableOpacity>
	) : (
		<ActivityIndicator size='large' />
	)
}

const styles = StyleSheet.create({
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
	},
})
