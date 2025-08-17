// apps/web/src/features/tiles/components/Leaderboard.tsx

import React from 'react'
import { FlatList, Text, View } from 'react-native'
import { useAuth, useTheme } from '@shared/hooks'
import { Column, Row } from '@shared/grid'
import { Score } from '@iam/types'
import { Size } from '@iam/theme'
import { Button, IconButton } from '@shared/buttons'
import { Avatar } from '@shared/ui'
// import { formatRelative } from 'date-fns'

type LeaderboardProps = {
    scores: Score[]
    clearScores: () => void
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ scores, clearScores }) => {

    const { user } = useAuth()
    const { theme } = useTheme()
    // const { scores, clearScores, fetchScores } = useScores()
    
    // useEffect(() => {
    //     // refetch()
    //     console.log('Leaderboard init: scores:', scores)
    // }, [])

    // useEffect(() => {
    //     console.log('Leaderboard.scores:', scores)
    // }, [scores])

    // useEffect(() => {
    //     // console.log('SCORE:', scores)
    //     fetchScores()
    // }, [])

    const renderItem = (item: Score) => {
        return (
            <Row spacing={12} align='center' justify='space-between' paddingVertical={2}>
                <Row spacing={6} align='center' paddingVertical={Size.XS}>
                    <Avatar user={item.user} size='xs' />
                    <Text style={{ color: theme.colors.text }}>{item.user.username}</Text>
                </Row>
                <Text style={{ color: theme.colors.text }}>{item.score}</Text>
                {/* <Text style={{ color: theme.colors.text }}>{formatRelative(new Date(item.createdAt), new Date())}</Text> */}
            </Row>
        )
    }

	return (
        <Column spacing={6}>
            <Row
                spacing={12}
                align='center'
                justify='space-between'
            >
                <Text
                    style={[
                        {
                            color: theme.colors.text,
                            fontSize: 20,
                            fontWeight: 'bold',
                        },
                    ]}
                >
                    High Scores
                </Text>

                {/* {scores.length > 0 && user?.role === 'admin' && (
                    <IconButton
                        iconName='close'
                        onPress={clearScores}
                    />
                )} */}
            </Row>
            
            <Column flex={1}>
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={scores}
                        extraData={scores}
                        keyExtractor={(item) => item._id}
                        scrollEnabled={false}
                        renderItem={({ item }) => renderItem(item)}
                        // style={{ flex: 1 }}
                        // contentContainerStyle={{ backgroundColor: 'yellow' }}
                    />
                </View>
                
            </Column>
        </Column>
	)
}
