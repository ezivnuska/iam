// apps/web/src/features/tiles/components/GameBoard.tsx

import React, { useCallback, useEffect, useMemo, useState }  from 'react'
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native'
import { CheckerBoard } from './'
import { Position, TileType } from '../types'
import Animated, { clamp, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'

type GameBoardProps = {
    level: number
}

type Dimensions = {
    width: number
    height: number
}

export const GameBoard: React.FC<GameBoardProps> = ({
  level = 4,
}) => {
    const [dims, setDims] = useState<Dimensions>()
    const [itemSize, setItemSize] = useState<number>()
    const [tiles, setTiles] = useState<TileType[]>([])
    const [draggedTile, setDraggedTile] = useState<TileType | null>(null)
    const [positions, setPositions] = useState<Position[]>([])

    const offset = useSharedValue(0)

    const getEmptyRow = useCallback(() => {
        let emptyRow = null
        if (tiles) {
            for (let r = 0; r < level; r++) {
                const rowTiles = tiles.filter(t => t.position.row === r)
                if (rowTiles.length < level) emptyRow = r
            }
        }
        return emptyRow
    }, [tiles])

    const getEmptyCol = useCallback(() => {
        let emptyCol =null
        if (tiles) {
            for (let c = 0; c < level; c++) {
                const colTiles = tiles.filter(t => t.position.col === c)
                if (colTiles.length < level) emptyCol = c
            }
        }
        return emptyCol
    }, [tiles])
    
    const emptyPos = useMemo(() => {
        const col = getEmptyCol()
        const row = getEmptyRow()
        return (col !== null && row !== null) ? { col, row } : null
    }, [tiles])

    const dragDirection = useMemo(() => {
        let direction = 'none'
        if (emptyPos) {
            console.log('emptyPos', emptyPos)
            if (draggedTile) {
                console.log('draggedTile', draggedTile)
                const { col, row } = emptyPos
                if (draggedTile.position.col === col) {
                    direction = draggedTile.position.row < row ? 'down' : 'up'
                } else if (draggedTile.position.row === row) {
                    direction = draggedTile.position.col < col ? 'right' : 'left'
                }
            }
        }
        console.log('direction', direction)
        return direction
    }, [emptyPos, draggedTile])

    const draggableTiles = useMemo<TileType[]>(() => {
        if (emptyPos) {
            const { col, row } = emptyPos
            return tiles.filter(tile => tile.position.col === col || tile.position.row === row)
        }
        return []
    }, [emptyPos])

    const isTileDraggable = (tile: TileType) => {
        return draggableTiles.filter(t => t.id === tile.id).length
    }

    const draggingTiles = useMemo(() => {
        let tilesDragging: TileType[] = []
        if (!draggedTile || !emptyPos) return tilesDragging
        const { col, row } = emptyPos
        tilesDragging = draggableTiles.filter(t =>
            t.id === draggedTile.id ||
            (dragDirection === 'up' && t.position.row > row! && t.position.row < draggedTile.position.row) ||
            (dragDirection === 'down' && t.position.row < row! && t.position.row > draggedTile.position.row) ||
            (dragDirection === 'left' && t.position.col > col! && t.position.col < draggedTile.position.col) ||
            (dragDirection === 'right' && t.position.col < col! && t.position.col > draggedTile.position.col)
        )
        console.log('tilesDragging', tilesDragging)
        return tilesDragging
    }, [draggedTile])

    const isTileDragging = useCallback((tile: TileType) => {
        return draggedTile && draggingTiles.filter(t => t.id === tile.id).length
    }, [draggingTiles, draggedTile])

    useEffect(() => {
        console.log('draggingTiles', draggingTiles)
    }, [draggingTiles])

    useEffect(() => {
        if (dims) {
            setItemSize(dims.width / level)
        }
    }, [dims])

    useEffect(() => {
        if (itemSize) {
            initPositions()
        }
    }, [itemSize])

    const initPositions = () => {
        const initialPositions: Position[] = []
        let id = 0
        for (let row = 0; row < level; row++) {
            for (let col = 0; col < level; col++) {
                initialPositions.push({ id, row, col })
                id++
            }
        }
        setPositions(initialPositions)
    }

    const initTiles = () => {
        const initialTiles: TileType[] = []
        while (initialTiles.length < positions.length) {
            initialTiles.push({
                id: initialTiles.length,
                position: positions[initialTiles.length],
            })
        }
        const emptySpace = initialTiles.pop()

        setTiles(initialTiles)
    }

    useEffect(() => {
        if (positions.length && !tiles.length) {
            initTiles()
        }
    }, [positions])

    const getTileCoords = (tile: TileType) => {
        if (!itemSize) return null
        const pos = tile.position
        return {
            x: pos.col * itemSize,
            y: pos.row * itemSize,
        }
    }

    const onLayout = async (e: LayoutChangeEvent) => {
        const { layout } = e.nativeEvent
        if (!layout) return
        setDims({ width: layout.width, height: layout.height})
    }

    const resetOffsetValue = () => {
        offset.value = 0
    }

    const onTouchStart = (event: any, tile: TileType) => {
        if (isTileDraggable(tile)) {
            console.log('draggable tile touched', tile)
            setDraggedTile(tile)
        }
    }

    const handleDrag = (event: any, tile: TileType) => {
        if (!itemSize) return
        const { translationX, translationY } = event
        const isHorizontal = dragDirection === 'left' || dragDirection === 'right'
        offset.value = isHorizontal
            ? dragDirection === 'left'
                ? clamp(translationX, -itemSize, 0)
                : clamp(translationX, 0, itemSize)
            : dragDirection === 'up'
                ? clamp(translationY, -itemSize, 0)
                : clamp(translationY, 0, itemSize)
    }

    const onTouchMove = (event: any, tile: TileType) => {
        if (draggedTile) {
            handleDrag(event, tile)
        }
    }

    const getNewPosition = (tile: TileType) => {
        switch (dragDirection) {
            case 'up': return { ...tile.position, row: tile.position.row - 1 }
            case 'down': return { ...tile.position, row: tile.position.row + 1 }
            case 'left': return { ...tile.position, col: tile.position.col - 1 }
            case 'right': return { ...tile.position, col: tile.position.col + 1 }
            default: return tile.position
        }
    }

    const moveDraggingTilesToNextPosition = () => {
        setTiles(
            tiles.map(t => isTileDragging(t)
                ? { ...t, position: getNewPosition(t) }
                : t
            )
        )
        setDraggedTile(null)
        resetOffsetValue()
    }

    const onTileMoved = (tile: TileType) => {
        moveDraggingTilesToNextPosition()
    }

    const onTileReset = () => {
        setDraggedTile(null)
        resetOffsetValue()
    }

    const moveTile = (tile: TileType) => {
        if (!itemSize) return
        const isHorizontal = dragDirection === 'left' || dragDirection === 'right'
        let value = isHorizontal
            ? dragDirection === 'left' ? -itemSize : itemSize
            : dragDirection === 'up' ? -itemSize : itemSize

        offset.value = withTiming(value, { duration: 250 }, () => onTileMoved(tile))
    }

    const resetTile = () => {
        offset.value = withTiming(0, { duration: 250 }, onTileReset)
    }

    const handleMove = (event: any, tile: TileType) => {
        if (!itemSize) return
        const { translationX, translationY } = event
        const isHorizontal = dragDirection === 'left' || dragDirection === 'right'
        let newValue = isHorizontal ? translationX : translationY
        const shouldMove = Math.abs(newValue) > itemSize / 2
        if (shouldMove) {
            moveTile(tile)
        } else {
            resetTile()
        }
    }

    const onTouchEnd = (event: any, tile: TileType) => {
        handleMove(event, tile)
    }

    const animatedStyle = useAnimatedStyle(() => {
        const isHorizontal = dragDirection === 'left' || dragDirection === 'right'
        return {
            transform: [isHorizontal ? { translateX: offset.value } : { translateY: offset.value }],
            backgroundColor: 'purple',
        }
    })

    const isDragging = (tile: TileType) => {
        console.log('')
        let dragging = false
        if (draggedTile && draggingTiles.filter(t => t.id === tile.id).length) dragging = true
        return dragging
    }

    const renderTiles = () => {
        if (!tiles || !itemSize) return null
        return (
            <View style={styles.tileContainer}>
                {tiles?.map((tile) => {
                    const coords = getTileCoords(tile)
                    if (!coords) return
                    const draggable = isTileDraggable(tile)
                    const { x, y } = coords

                    const panGesture = Gesture.Pan()
                        .onBegin(event => onTouchStart(event, tile))
                        .onChange(event => onTouchMove(event, tile))
                        .onFinalize(event => onTouchEnd(event, tile))

                    return (
                        <Animated.View
                            key={tile.id}
                            style={[
                                {
                                    position: 'absolute',
                                    height: itemSize,
                                    width: itemSize,
                                    top: y,
                                    left: x,
                                    borderRadius: 10,
                                    overflow: 'hidden',
                                    backgroundColor: draggable ? '#4682b4' : 'green',
                                },
                                isDragging(tile) ? animatedStyle : null,
                            ]}
                        >
                            <GestureDetector gesture={panGesture}>
                                <View
                                    style={{
                                        height: itemSize,
                                        width: itemSize,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Text style={styles.label}>{tile.id + 1}</Text>
                                </View>
                            </GestureDetector>
                        </Animated.View>
                    )
                })}
            </View>
        )
    }
    
    return (
        <View
            onLayout={onLayout}
            style={styles.container}
        >
            <CheckerBoard level={4} />
            {tiles && renderTiles()}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        position: 'relative',
        marginBottom: 12,
    },
    board: {
        position: 'absolute',
        top: 0, right: 0, bottom: 0, left: 0,
        zIndex: 10,
    },
    row: {
        flex:1,
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'center',
    },
    square: {
        flex: 1,
        width: '33%',
    },
    black: {
        backgroundColor: '#555',
    },
    white: {
        backgroundColor: '#777',
    },
    tileContainer: {
        position: 'absolute',
        top: 0, right: 0, bottom: 0, left: 0,
        zIndex: 20,
    },
    positionContainer: {
        position: 'absolute',
        top: 0, right: 0, bottom: 0, left: 0,
        zIndex: 30,
    },
    label:{
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
    },
})
