// apps/web/src/features/tiles/components/GameBoard.tsx

import React, { useCallback, useEffect, useMemo, useState }  from 'react'
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native'
import { Direction, GameStatus, TileType } from '../types'
import Animated, { clamp, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { useTheme } from '@shared/hooks'
import { useTiles } from '../hooks'

export type Dimensions = {
    width: number
    height: number
}


export const TileGame: React.FC = () => {

    const {
        emptySpace,
        level,
        status,
        tiles,
        setStatus,
        setTiles,
    } = useTiles()

    const [dims, setDims] = useState<Dimensions>()
    const [itemSize, setItemSize] = useState<number>()
    const [draggedTile, setDraggedTile] = useState<TileType | null>()

	const { theme } = useTheme()

    const offset = useSharedValue(0)

    const onLayout = async (e: LayoutChangeEvent) => {
        const { layout } = e.nativeEvent
        if (!layout) return
		let size = layout.height < layout.width ? layout.height : layout.width
        setDims({ width: size, height: size })
    }

    useEffect(() => {
        if (dims) {
            setItemSize(dims.width / level)
        }
    }, [dims])

    useEffect(() => {
        if (itemSize) {
            setStatus(GameStatus.IDLE)
        }
    }, [itemSize])

    useEffect(() => {
		if (draggedTile) {
			setDraggedTile(null)
			resetOffsetValue()
		}
    }, [tiles])

    const isTileDraggable = useCallback((tile: TileType) => {
		if (status !== 'playing' || !emptySpace) return false
        const { col, row } = emptySpace
        const draggables = tiles.filter(tile => tile.col === col || tile.row === row)
        return draggables.filter(t => t.id === tile.id).length > 0
    }, [emptySpace, status])

    const dragDirection = useMemo(() => {
            let direction = Direction.NONE
            if (emptySpace && draggedTile) {
                const { col, row } = emptySpace
                if (draggedTile.col === col) {
                    direction = draggedTile.row < row ? Direction.DOWN : Direction.UP
                } else if (draggedTile.row === row) {
                    direction = draggedTile.col < col ? Direction.RIGHT : Direction.LEFT
                }
            }
            return direction
    }, [draggedTile])

	const isTileDragging = useCallback((tile: TileType) => {
		if (!draggedTile || !emptySpace) return false
        const { col, row } = emptySpace

		let draggingTiles = tiles.filter(t => (
			t.id === draggedTile.id ||
			(dragDirection === Direction.UP && t.col === col && t.row > row! && t.row < draggedTile.row) ||
			(dragDirection === Direction.DOWN && t.col === col && t.row < row && t.row > draggedTile.row) ||
			(dragDirection === Direction.LEFT && t.row === row && t.col > col! && t.col < draggedTile.col) ||
			(dragDirection === Direction.RIGHT && t.row === row && t.col < col! && t.col > draggedTile.col)
		))
		return draggingTiles.filter(t => t.id === tile.id).length > 0
	}, [draggedTile])

    const getTileCoords = (tile: TileType) => {
        if (!itemSize) return null
        const { col, row } = tile
        return {
            x: col * itemSize,
            y: row * itemSize,
        }
    }

    const resetOffsetValue = () => {
        offset.value = 0
    }

	const finalizeMove = () => {
		const movedTiles = tiles.map(t => getMovedTile(t, dragDirection))
		setTiles(movedTiles)
	}

    const onTouchStart = (event: any, tile: TileType) => {
        if (isTileDraggable(tile)) {
            setDraggedTile(tile)
        }
    }

    const isHorizontal = useMemo(() => {
        return (dragDirection === 'left' || dragDirection === 'right')
    }, [dragDirection])

    const handleDrag = (event: any, tile: TileType) => {
        if (!itemSize) return
        const { translationX, translationY } = event
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

    const getMovedTile = (tile: TileType, direction: Direction) => {
		if (isTileDragging(tile)) {
			switch (direction) {
				case Direction.UP: return { ...tile, row: tile.row - 1 }
				case Direction.DOWN: return { ...tile, row: tile.row + 1 }
				case Direction.LEFT: return { ...tile, col: tile.col - 1 }
				case Direction.RIGHT: return { ...tile, col: tile.col + 1 }
				default: return tile
			}
		}
		return tile
    }

    const onTileReset = () => {
		resetOffsetValue()
        setDraggedTile(null)
    }

    const moveTiles = () => {
        if (!itemSize) return
        let value = isHorizontal
            ? dragDirection === Direction.LEFT ? -itemSize : itemSize
            : dragDirection === Direction.UP ? -itemSize : itemSize

        offset.value = withTiming(value, { duration: 50 }, () => finalizeMove())
    }

    const resetTile = () => {
        offset.value = withTiming(0, { duration: 50 }, onTileReset)
    }

    const handleMove = (event: any, tile: TileType) => {
        if (!itemSize) return
        const { translationX, translationY } = event
        const isClick = translationX < 5 && translationY < 5
        let newValue = isHorizontal ? translationX : translationY
        const shouldMove = isClick || Math.abs(newValue) > itemSize / 2
        if (shouldMove) {
            moveTiles()
        } else {
            resetTile()
        }
    }

    const onTouchEnd = (event: any, tile: TileType) => {
        handleMove(event, tile)
    }

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                isHorizontal
                    ? { translateX: offset.value }
                    : { translateY: offset.value }
            ],
        }
    })

    const renderSquare = (tile: TileType) => {
        return itemSize && (
            <View
                style={{
                    height: itemSize,
                    width: itemSize,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
					borderWidth: 1,
					borderColor: theme.colors.background,
                    backgroundColor: getTileColor(tile)
                }}
            >
                <Text style={styles.label}>{tile.id + 1}</Text>
            </View>
        )
    }

    const getTileColor = (tile: TileType) => {
        const draggable = isTileDraggable(tile)
        switch (status) {
            case GameStatus.RESOLVED: return 'red'
            case GameStatus.IDLE: return 'green'
            case GameStatus.PAUSED: return '#aaa'
            case GameStatus.PLAYING: return draggable ? 'blue' : 'green'
            default: return 'green'
        }
    }

    const renderTiles = () => {
        return tiles.map((tile) => {
			const coords = getTileCoords(tile)
			if (!coords) return
			const draggable = isTileDraggable(tile)
			const dragging = isTileDragging(tile)
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
							top: y,
							left: x,
							borderRadius: 10,
							overflow: 'hidden',
							cursor: draggable ? 'pointer' : 'auto',
						},
						dragging && animatedStyle,
					]}
				>
					<GestureDetector gesture={panGesture}>
						{renderSquare(tile)}
					</GestureDetector>
				</Animated.View>
			)
		})
    }

    return (
        <View style={{ flex: 1 }}>
			<View
				onLayout={onLayout}
				style={styles.container}
			>
				{dims && (
					<View
						style={[
							{ width: dims.width, height: dims.height },
							styles.tileContainer,
						]}
					>
						{tiles && renderTiles()}
					</View>
				)}
			</View>
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
    black: {
        backgroundColor: '#555',
    },
    white: {
        backgroundColor: '#777',
    },
    tileContainer: {
        position: 'relative',
		overflow: 'hidden',
		alignSelf: 'center',
    },
    label:{
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
    },
})
