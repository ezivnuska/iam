// apps/web/src/components/LinkPreview.tsx

import React, { useEffect, useMemo, useState } from 'react'
import { Dimensions, Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Column, Row } from './Layout'
import { scrape } from '@services'
import { resolveResponsiveProp, Size } from '@/styles'

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
	const [error, setError] = useState(false)
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

            const trySetImageAspect = (imageUrl?: string) => {
                if (!imageUrl) return
                Image.getSize(
                    imageUrl,
                    (w, h) => setAspectRatio(w / h),
                    () => setAspectRatio(1) // fallback
                )
            }

            try {
                if (memoryCache.has(url)) {
                    const cachedData = memoryCache.get(url)!
                    setData(cachedData)
                    trySetImageAspect(cachedData.image)
                    return
                }

                const cached = await AsyncStorage.getItem(cacheKey)
                if (cached) {
                    const parsed = JSON.parse(cached)
                    setData(parsed)
                    memoryCache.set(url, parsed)
                    trySetImageAspect(parsed.image)
                    return
                }

                timeoutId = setTimeout(async () => {
                    try {
                        const response = await scrape(url)
                        console.log('response', response)
                        if (response) {
                            setData(response)
                            memoryCache.set(url, response)
                            trySetImageAspect(response.image)
                            await AsyncStorage.setItem(cacheKey, JSON.stringify(response))
                        } else {
                            setError(true)
                        }
                    } catch (err) {
                        setError(true)
                    }
                }, 300)
            } catch (error) {
                console.warn('Error fetching or caching metadata:', error)
                setError(true)
            }
        }

        init()

        return () => clearTimeout(timeoutId)
    }, [url])

	const openExternalUrl = () => {
		Linking.openURL(url).catch(err => console.error('Error loading page', err))
	}

    if (error) {
        return <Text style={styles.loadingText}>Could not load link preview</Text>
    }
    
    if (!data) {
        return <Text style={styles.loadingText}>Loading link...</Text>
    }
    
	return (
		<TouchableOpacity onPress={openExternalUrl}>
			<Column spacing={16}>
				{data.image && (
                    <View style={{ width: '100%', maxWidth, marginHorizontal: 'auto' }}>
                        <Image
                            source={{ uri: data.image }}
                            style={{ width: '100%', aspectRatio: aspectRatio || 1 }}
                            resizeMode='cover'
                        />
                    </View>
				)}
				<Column spacing={Size.XS} paddingHorizontal={Size.M}>
					{data.title && <Text style={styles.heading}>{data.title}</Text>}
                    <Text style={styles.description}>{data.description}</Text>
				</Column>
			</Column>
		</TouchableOpacity>
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
    loadingText: {
        color: '#bbb',
        paddingHorizontal: Size.M,
    },
})
