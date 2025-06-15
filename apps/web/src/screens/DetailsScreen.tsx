// apps/web/src/screens/DetailsScreen.tsx

import React, { useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { useRoute } from '@react-navigation/native'
import { Avatar, PageLayout, Row, Column, ImageGallery } from '../components'
import { User } from '@iam/types'
import { getUserById } from '@services'
import { Size } from '@/styles'
import { useUserImages } from '@/hooks'

type DetailsParams = {
    id: string
}

export const DetailsScreen = () => {
	const route = useRoute()
    const { id } = route.params as DetailsParams

    const [userDetails, setUserDetails] = useState<User | null>(null)
    const [loading, setLoading] = useState(false)

    const { images, isLoading, loadUserImages } = useUserImages()

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true)
            try {
                const response = await getUserById(id)
                setUserDetails(response)
                loadUserImages(response.username)
            } catch (error: any) {
                throw new Error(error.message)
            } finally {
                setLoading(false)
            }
        }
        fetchDetails()
    }, [])

    if (loading) {
        return (
            <View
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <ActivityIndicator size={50} />        
            </View>
        )
    }

	return (
        <PageLayout>
            {userDetails && (
                <Column
                    paddingVertical={Size.S}
                    paddingHorizontal={Size.M}
                    flex={1}
                    spacing={15}
                >
                    <Row spacing={15}>
                        <Avatar
                            user={userDetails}
                            size='lg'
                        />
                        <Column spacing={5}>
                            <Text style={[styles.text, styles.username]}>{userDetails?.username}</Text>
                            <Text style={[styles.text, styles.email]}>{userDetails?.email}</Text>
                        </Column>
                    </Row>
                    <Row spacing={10}>
                        <Text style={styles.text}>{userDetails?.bio || 'No bio yet.'}</Text>
                    </Row>
                    <ImageGallery images={images} />
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
})