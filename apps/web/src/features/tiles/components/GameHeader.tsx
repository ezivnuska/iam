// apps/web/src/features/tiles/components/GameHeader.tsx

import React, { useEffect, useMemo, useState } from 'react'
import { Pressable, Text } from 'react-native'
import { Button } from '@shared/buttons'
import { Row } from '@shared/grid'
import { usePlay } from '@shared/hooks'
import { GameStatus } from '../types'

type GameHeaderProps = {
  status: GameStatus
  onChangeStatus: (status: GameStatus) => void
}

export const GameHeader: React.FC<GameHeaderProps> = ({ status, onChangeStatus }) => {
  const { ticks, startTicker, stopTicker, resetTicks } = usePlay()

  const [score, setScore] = useState<string | null>(null)

  const formattedTime = useMemo(() => {
    const m = Math.floor(ticks / 60)
    const s = ticks < 60 ? ticks : ticks % 60
    return `${m > 0 ? (m < 10 ? `0${m}` : `${m}`) : `00`}:${s < 10 ? `0${s}` : s}`
  }, [ticks])

  useEffect(() => {
    switch (status) {
      case 'idle':
        resetTicks()
        break
      case 'start':
        startPlay()
        break
      case 'playing':
        startTicker()
        break
      case 'paused':
        stopTicker()
        break
      case 'resolved':
        setScore(formattedTime)
        stopTicker()
        handleWin()
        break
      default:
        break
    }
  }, [status])

  const handleWin = () => onChangeStatus('resolved')
  const startPlay = () => onChangeStatus('start')
  const unpause = () => onChangeStatus('playing')
  const pause = () => onChangeStatus('paused')
  const reset = () => {
    resetTicks()
    setScore(null)
    onChangeStatus('idle')
  }

  return (
    <Row justify="space-between">
      <Row flex={1} spacing={10}>
        {status === 'idle' && <Button label='Start' onPress={startPlay} />}
        {status === 'playing' && <Button label='Pause' onPress={pause} />}
        {status === 'resolved' && <Button label='Finish' onPress={reset} />}
        {status === 'paused' && <Button label='Continue' onPress={unpause} />}
        {status === 'paused' && <Button label='Give Up' onPress={reset} />}
      </Row>

      {score ? (
        <Pressable
          style={{
            flexBasis: 'auto',
            backgroundColor: '#f00',
            borderRadius: 6,
            overflow: 'hidden',
            paddingHorizontal: 10,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Text>Score: {formattedTime}</Text>
        </Pressable>
      ) : (
        ticks > 0 && <Text>Time: {formattedTime}</Text>
      )}
    </Row>
  )
}

export default GameHeader
