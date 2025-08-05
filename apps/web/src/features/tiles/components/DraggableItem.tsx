// // apps/web/src/features/tiles/components/DraggableItem.tsx

// import React, { useEffect, useMemo, useState }  from 'react'
// import { StyleSheet, Text, View } from 'react-native'
// import Animated, { clamp, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'
// import { Gesture, GestureDetector } from 'react-native-gesture-handler'
// import { Direction, TileType } from '../types'

// type DraggableItemProps = {
//     size: number
//     tile: TileType
//     onMoved: (tile: TileType) => void
// }

// export const DraggableItem: React.FC<DraggableItemProps> = ({
//     size,
//     tile,
//     onMoved,
//   ...rest
// }) => {
//     const [dragging, setDragging] = useState<boolean>(false)
//     const [visible, setVisible] = useState<boolean>(false)
    
//     const offset = useSharedValue(0)

//     const draggable = useMemo(() => tile?.direction !== 'none', [tile])

//     useEffect(() => {
//         if (tile) setVisible(true)
//     }, [tile])

//     const direction = useMemo(() => {
//         let dragDirection = 'none'
//         switch (tile.direction) {
//             case 'left':
//             case 'right':
//                 dragDirection = 'horizontal'
//                 break
//             case 'up':
//             case 'down':
//                 dragDirection = 'vertical'
//                 break
//         }
//         return dragDirection
//     }, [tile])


//     const tileCoords = useMemo(() => {
//         // if (!size) return null
//         const pos = tile.position
//         return {
//             x: pos.col * size,
//             y: pos.row * size,
//         }
//     }, [tile])

//     const getNextPosition = () => {
//         let movedTile = tile
//         if (dragging) {
//             switch (tile.direction) {
//                 case 'up':
//                     movedTile = { ...tile, position: { ...tile.position, row: tile.position.row - 1 }, direction: 'down'  }
//                     break
//                 case 'down':
//                     movedTile = { ...tile, position: { ...tile.position, row: tile.position.row + 1 }, direction: 'up' }
//                     break
//                 case 'left':
//                     movedTile = { ...tile, position: { ...tile.position, col: tile.position.col - 1 }, direction: 'right'  }
//                     break
//                 case 'right':
//                     movedTile = { ...tile, position: { ...tile.position, col: tile.position.col + 1 }, direction: 'left'  }
//                     break
//             }
//         }
//         return movedTile as TileType
//     }

//     const animatedStyle = useAnimatedStyle(() => ({
//         transform: [direction === 'horizontal' ? { translateX: offset.value } : { translateY: offset.value }],
//     }))

//     const resetOffsetValue = () => {
//         offset.value = 0
//     }

//     const onTouchStart = (event: any) => {
//         if (draggable) setDragging(true)
//         console.log('tile', tile)
//     }

//     const getBounds = (direction: Direction) => {
        
//     }

//     const handleDrag = (event: any) => {
//         const { translationX, translationY } = event
//         const isHorizontal = direction === 'horizontal'
//         offset.value = isHorizontal
//             ? tile.direction === 'left'
//                 ? clamp(translationX, -size, 0)
//                 : clamp(translationX, 0, size)
//             : tile.direction === 'up'
//                 ? clamp(translationY, -size, 0)
//                 : clamp(translationY, 0, size)
//     }
//     // const handleDrag = (event: any) => {
//     //     const { translationX, translationY } = event
//     //     const isHorizontal = direction === 'horizontal'
//     //     offset.value = isHorizontal
//     //         ? tile.direction === 'left'
//     //             ? clamp(translationX, -size, 0)
//     //             : clamp(translationX, 0, size)
//     //         : tile.direction === 'up'
//     //             ? clamp(translationY, -size, 0)
//     //             : clamp(translationY, 0, size)
//     // }

//     const onTouchMove = (event: any) => {
//         if (dragging) {
//             handleDrag(event)
//         }
//     }

//     const onTileMoved = () => {
//         setVisible(false)
//         setDragging(false)
//         resetOffsetValue()
//         onMoved(getNextPosition())
//     }

//     const moveTile = () => {
//         const xValue = tile.direction === 'left' ? -size : size
//         const yValue = tile.direction === 'up' ? -size : size
//         const newValue = direction === 'horizontal' ? xValue : yValue
//         offset.value = withTiming(newValue, { duration: 250 }, onTileMoved)
//     }

//     const resetTile = () => {
//         offset.value = withTiming(0, { duration: 250 }, () => setDragging(false))
//     }

//     const handleMove = (event: any) => {
//         const { translationX, translationY } = event
//         const isHorizontal = direction === 'horizontal'
//         let newValue = isHorizontal ? translationX : translationY
//         const shouldMove = Math.abs(newValue) > size / 2
//         if (shouldMove) {
//             moveTile()
//         } else {
//             resetTile()
//         }
//     }

//     const onTouchEnd = (event: any) => {
//         handleMove(event)
//     }

//     const panGesture = Gesture.Pan()
//         .onBegin(onTouchStart)
//         .onChange(onTouchMove)
//         .onFinalize(onTouchEnd)
//         // .onFinalize(stopDragging)
    
//     // const position = useMemo(() => {
//     //     return {
//     //         top: tile.row * size,
//     //         left: tile.col * size,
//     //     }
//     // }, [])

//     const renderLabel = () => {
//         switch (tile.direction) {
//             // case 'left':
//             //     return <Ionicons name='arrow-back' size={24} color='white' />
//             //     break
//             // case 'right':
//             //     return <Ionicons name='arrow-forward' size={24} color='white' />
//             //     break
//             // case 'up':
//             //     return <Ionicons name='arrow-up' size={24} color='white' />
//             //     break
//             // case 'down':
//             //     return <Ionicons name='arrow-down' size={24} color='white' />
//             //     break
//             default: return <Text style={styles.label}>{tile.id}</Text>
//         }
//     }
    
//     return visible ? (
//         <Animated.View
//             {...rest}
//             style={[
//                 {
//                     position: 'absolute',
//                     height: size,
//                     width: size,
//                     top: tileCoords.y,
//                     left: tileCoords.x,
//                     borderRadius: 10,
//                     overflow: 'hidden',
//                 },
//                 (draggable && dragging) ? animatedStyle : null,
//             ]}
//         >
//             <GestureDetector gesture={panGesture}>
//                 <View
//                     style={{
//                         height: size,
//                         width: size,
//                         backgroundColor: direction !== 'none' ? '#4682b4' : dragging ? '#ff8c00' : 'green',
//                         flexDirection: 'row',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                     }}
//                 >
//                     {renderLabel()}
//                 </View>
//             </GestureDetector>
//         </Animated.View>
//     ) : null
// }

// const styles = StyleSheet.create({
//     label:{
//         fontSize: 24,
//         color: '#fff',
//         fontWeight: 'bold',
//     },
// })
