// apps/web/src/screens/DetailsScreen.tsx

import React, { useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { useRoute } from '@react-navigation/native'
import { PageHeader, PageLayout, Row, Column } from '../components'
import { User } from '@iam/types'
import { getUserById } from '@services'

type DetailsParams = {
    id: string
}

export const DetailsScreen = () => {
	const route = useRoute()
    const { id } = route.params as DetailsParams

    const [userDetails, setUserDetails] = useState<User | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true)
            try {
                const response = await getUserById(id)
                setUserDetails(response)
            } catch (error: any) {
                throw new Error(error.message)
            } finally {
                setLoading(false)
            }
        }
        fetchDetails()
    }, [])

	return (
        <PageLayout>
            {loading
                ? (
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <ActivityIndicator size={50} />        
                    </View>
                ) : (
                    <>
                        <PageHeader title={`Profile: ${userDetails?.username || ''}`} />
                        <Column
                            spacing={10}
                            align='flex-start'
                        >
                            <Text style={[styles.text, styles.username]}>{userDetails?.username}</Text>
                            <Text style={[styles.text, styles.email]}>{userDetails?.email}</Text>
                        </Column>
                    </>
                )
            }
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