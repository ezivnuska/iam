// apps/web/src/features/tiles/components/TileGameHeader.tsx

import React, { useMemo } from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'
import { Button, IconButton } from '@shared/buttons'
import { Column, Row } from '@shared/grid'
import { useTiles } from '../hooks'
import { useModal, useTheme } from '@shared/hooks'
import { GameStatus } from '../types'
import { Size } from '@iam/theme'
import { Score } from '@iam/types'
import { Avatar } from '@shared/ui'
import { Leaderboard } from './Leaderboard'
import Ionicons from '@expo/vector-icons/Ionicons'

export const TileGameHeader: React.FC = () => {

    const { hideModal, showModal } = useModal()

    const {
        scores,
        status,
        ticks,
        time,
        clearScores,
        setStatus,
    } = useTiles()

    const { theme } = useTheme()
    
    const startPlay = () => setStatus(GameStatus.START)
    const unpause = () => setStatus(GameStatus.PLAYING)
    const pause = () => setStatus(GameStatus.PAUSED)
    const reset = () => setStatus(GameStatus.IDLE)
    const restart = () => setStatus(GameStatus.START)

    const topScore = useMemo(() => {
        if (scores.length > 0) {
            return scores[0]
        }
        return null
    }, [scores])

    const renderNavButton = () => {
        switch (status) {
            case GameStatus.IDLE: return renderStartButton()
            case GameStatus.PLAYING: return renderPauseButton()
            case GameStatus.PAUSED: return renderResumeButton()
            case GameStatus.RESOLVED: return renderReplayButton()
            default: return null
        }
    }

    const handleClearScores = async () => {
        await clearScores()
        hideModal()
    }

    const showLeaderboard = () => {
        showModal(<Leaderboard scores={scores} clearScores={handleClearScores} />)
    }

    const renderStartButton = () => status === 'idle' ? (
        <Button onPress={startPlay} label='Play' iconName='play' />
    ) : null

    const renderPauseButton = () => status === 'playing' ? (
        <Button onPress={pause} label='Pause' iconName='pause' />
    ) : null

    const renderResumeButton = () => status === 'paused' ? (
        <Button onPress={unpause} label='Resume' iconName='play' />
    ) : null

    const renderReplayButton = () => status === 'resolved' ? (
        <Button onPress={unpause} label='Winner' iconName='refresh' variant='success' />
    ) : null

    const renderKillButton = () => status === 'paused' ? (
        <Button onPress={reset} label='Quit' iconName='close-sharp' />
    ) : null

    const renderTopScore = () => topScore ? (
        <Pressable onPress={showLeaderboard}>
            <Column justify='center' align='center' spacing={4}>
                <Row justify='flex-end' align='center' spacing={4}>
                    <Text style={[styles.topLabel, { color: theme.colors.text }]}>Fastest</Text>
                    <Ionicons name='chevron-forward' size={16} color={theme.colors.text} />
                </Row>
                <Row align='center' spacing={6} style={{ width: '100%' }}>
                    <Avatar user={topScore.user} size='xs' />
                    <Text style={[styles.topScore, { color: theme.colors.text }]}>{topScore.score}</Text>
                </Row>
            </Column>
        </Pressable>
    ) : null

    return (
        <Row
            spacing={18}
            align='center'
            justify='space-between'
            paddingVertical={Size.M}
            style={{ width: '100%' }}
        >
            <Row spacing={8} align='center' wrap={false}>
                {renderNavButton()}
                {/* {renderResolveMessage()} */}
                {renderKillButton()}
            </Row>
            <Row flex={1} spacing={20} align='center' justify='center'>
                {time && <Text style={[styles.status, { color: theme.colors.text }]}>{ticks > 0 && time}</Text>}
            </Row>
            {renderTopScore()}
        </Row>
    )
}

const styles = StyleSheet.create({
    status: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    topLabel: {
        fontWeight: 'bold',
        fontSize: 14,
        lineHeight: 14,
    },
    topScore: {
        fontSize: 14,
        lineHeight: 14,
    },
    button: {
        flexBasis: 'auto',
        backgroundColor: '#f00',
        borderRadius: 6,
        overflow: 'hidden',
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
})
