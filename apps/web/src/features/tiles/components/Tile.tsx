import React from 'react'
import { Text, View } from 'react-native'

import { Direction } from '../types'

type TileProps = {
  direction?: Direction
  dragging?: boolean
  label: number
  size: number
  style?: any
}

export const Tile: React.FC<TileProps> = ({
  direction,
  dragging,
  label,
  size,
  style,
}) => {
  return (
    <View
      style={[
        {
          height: size,
          width: size,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'red',
        },
        style,
      ]}
    >
      <Text style={{ fontSize: 18, color: '#fff' }}>{label}</Text>
    </View>
  )
}
