// apps/web/src/features/tiles/components/TileGameHeader.tsx

import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { Button } from '@shared/buttons'
import { Row } from '@shared/grid'
import { useTiles } from '../hooks'
import { useTheme } from '@shared/hooks'
import { GameStatus } from '../types'
import { Size } from '@iam/theme'

export const TileGameHeader: React.FC = () => {
    const {
        status,
        ticks,
        time,
        setStatus,
    } = useTiles()

    const { theme } = useTheme()
    
    const startPlay = () => setStatus(GameStatus.START)
    const unpause = () => setStatus(GameStatus.PLAYING)
    const pause = () => setStatus(GameStatus.PAUSED)
    const reset = () => setStatus(GameStatus.IDLE)

    const renderNavButton = () => {
        let onPress
        switch (status) {
            case GameStatus.IDLE: onPress = startPlay; break
            case GameStatus.PLAYING: onPress = pause; break
            case GameStatus.PAUSED: onPress = unpause; break
            case GameStatus.RESOLVED: onPress = reset; break
        }
        let label
        switch (status) {
            case GameStatus.IDLE: label = 'Play'; break
            case GameStatus.PLAYING: label = 'Pause'; break
            case GameStatus.PAUSED: label = 'Resume'; break
            case GameStatus.RESOLVED: label = 'Play Again'; break
            default: ''
        }
        let iconName
        switch (status) {
            case GameStatus.IDLE: iconName = 'play'; break
            case GameStatus.PLAYING: iconName = 'pause'; break
            case GameStatus.PAUSED: iconName = 'play'; break
            case GameStatus.RESOLVED: iconName = 'refresh'; break
        }
        return onPress && <Button onPress={onPress} iconName={iconName} label={label} />
    }

    const renderKillButton = () => status === 'paused' ? (
        <Button onPress={reset} label='Quit' iconName='close-sharp' />
    ) : null

    const renderResolveMessage = () => status === 'resolved' ? (
        <Text style={[styles.status, { color: theme.colors.text }]}>Winner!</Text>
    ) : null

    return (
        <Row
            spacing={20}
            align='center'
            justify='space-between'
            paddingVertical={Size.M}
            style={{ width: '100%' }}
        >
            <Row flex={1} spacing={20} align='center'>
                {renderNavButton()}
            </Row>
            <Row flex={3} justify='center' spacing={20} align='center'>
                {time && <Text style={[styles.status, { color: theme.colors.text }]}>{ticks > 0 && time}</Text>}
            </Row>
            <Row flex={1} spacing={20} align='center' justify='flex-end'>
                {renderResolveMessage()}
                {renderKillButton()}
            </Row>
        </Row>
    )
}

const styles = StyleSheet.create({
    status: {
        fontWeight: 'bold',
        fontSize: 20,
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
