// apps/web/src/features/tiles/components/TileAnimated.tsx

import React, { useEffect } from 'react'
import Animated from 'react-native-reanimated'
import { Tile } from '.'

type TileAnimatedProps = {
  dragging: boolean
  label: number
  offset: { x: number; y: number }
  pan?: any
  size: number
  style?: any
}

const TileAnimated: React.FC<TileAnimatedProps> = ({
  dragging,
  label,
  offset,
  pan,
  size,
  style,
  ...props
}) => {
  const { x, y } = offset

  useEffect(() => {
    console.log(`${label} is ${dragging ? '' : 'NOT'} dragging`)
  }, [dragging])

  return (
    <Animated.View
      {...props}
      style={[
        {
          position: 'absolute',
          top: y,
          left: x,
          height: size,
          width: size,
          overflow: 'hidden',
          borderRadius: 8,
        },
        style || null,
      ]}
    >
      <Tile label={label} size={size} />
    </Animated.View>
  )
}

export default TileAnimated
