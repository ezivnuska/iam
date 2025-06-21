// apps/web/src/screens/DetailsScreen.tsx

import React, { useEffect, useState, useCallback } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { useRoute } from '@react-navigation/native'
import {
	Avatar,
	PageLayout,
	Row,
	Column,
	ImageGallery,
} from '@/components'
import { User, Image } from '@iam/types'
import { getUserById, fetchUserImages } from '@services'
import { Size } from '@/styles'

type DetailsParams = {
	id: string
}

export const DetailsScreen = () => {
	const route = useRoute()
	const { id } = route.params as DetailsParams

	const [userDetails, setUserDetails] = useState<User | null>(null)
	const [userLoading, setUserLoading] = useState(false)

	const [images, setImages] = useState<Image[]>([])
	const [isLoadingImages, setIsLoadingImages] = useState(false)
	const [page, setPage] = useState(1)
	const [hasNextPage, setHasNextPage] = useState(true)

	useEffect(() => {
		const fetchDetails = async () => {
			setUserLoading(true)
			try {
				const user = await getUserById(id)
				setUserDetails(user)
				await loadImages(id, 1, true)
			} catch (error: any) {
				console.error('Failed to fetch user details:', error.message)
			} finally {
				setUserLoading(false)
			}
		}
		fetchDetails()
	}, [id])

	const loadImages = useCallback(
		async (userId: string, pageToLoad: number, reset = false) => {
			if (isLoadingImages || (!hasNextPage && !reset)) return
			setIsLoadingImages(true)

			try {
				const { images: newImages, hasNextPage: morePages } =
					await fetchUserImages({ userId, page: pageToLoad })

				setImages(prev => (reset ? newImages : [...prev, ...newImages]))
				setHasNextPage(morePages)
				setPage(pageToLoad + 1)
			} catch (error) {
				console.error('Failed to fetch user images:', error)
			} finally {
				setIsLoadingImages(false)
			}
		},
		[isLoadingImages, hasNextPage]
	)

	const handleLoadMoreImages = () => {
		if (userDetails?.id && hasNextPage && !isLoadingImages) {
			loadImages(userDetails.id, page)
		}
	}

	if (userLoading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size={50} />
			</View>
		)
	}

	return (
		<PageLayout>
			{userDetails && (
				<Column paddingVertical={Size.S} paddingHorizontal={Size.M} flex={1} spacing={15}>
					<Row spacing={15}>
						<Avatar user={userDetails} size='lg' />
						<Column spacing={5}>
							<Text style={[styles.text, styles.username]}>{userDetails.username}</Text>
							<Text style={[styles.text, styles.email]}>{userDetails.email}</Text>
						</Column>
					</Row>
					<Row spacing={10}>
						<Text style={styles.text}>{userDetails.bio || 'No bio yet.'}</Text>
					</Row>
					<View style={{ flex: 1 }}>
						<ImageGallery
							images={images}
							loading={isLoadingImages}
							onEndReached={handleLoadMoreImages}
						/>
					</View>
				</Column>
			)}
		</PageLayout>
	)
}

const styles = StyleSheet.create({
	text: {
		fontSize: 18,
		textAlign: 'left',
	},
	username: {
		flex: 1,
		fontWeight: 'bold',
	},
	email: {
		color: '#77f',
		flex: 1,
	},
	loadingContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
})
