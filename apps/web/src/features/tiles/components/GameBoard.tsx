// apps/web/src/features/tiles/components/GameBoard.tsx

import React, { useCallback, useEffect, useMemo, useState }  from 'react'
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native'
import { CheckerBoard } from './'
import { Direction, TileType } from '../types'
import Animated, { clamp, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { Row } from '@shared/grid'
import { Button } from '@shared/buttons'
import { useDeviceInfo, useTheme } from '@shared/hooks'
import { Size } from '@iam/theme'

type GameBoardProps = {
    level: number
}

type Dimensions = {
    width: number
    height: number
}

type EmptyPosition = {
    col: number
    row: number
}

type GameStatus = 'idle' | 'start' | 'playing' | 'paused' | 'resolved'

export const GameBoard: React.FC<GameBoardProps> = ({
  level = 4,
}) => {
    const [dims, setDims] = useState<Dimensions>()
    const [itemSize, setItemSize] = useState<number>()
    const [tiles, setTiles] = useState<TileType[]>([])
    const [draggedTile, setDraggedTile] = useState<TileType | null>(null)
    const [emptySpace, setEmptySpace] = useState<EmptyPosition>()
	const [status, setStatus] = useState<GameStatus>()

	const { theme } = useTheme()
	const { orientation } = useDeviceInfo()

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
            setStatus('idle')
        }
    }, [itemSize])

    const initTiles = () => {
        const initialTiles: TileType[] = []
        let id = 0
        for (let row = 0; row < level; row++) {
            for (let col = 0; col < level; col++) {
                initialTiles.push({ id, row, col })
                id++
            }
        }

        const lastTile = initialTiles.pop()
		let empty = { col: level - 1, row: level - 1 }
		if (lastTile) empty = { col: lastTile.col, row: lastTile.row }
		setEmptySpace(empty)

        setTiles(initialTiles)
    }

	const resolveTiles = useCallback(() => {
		if (!tiles?.length) return false
		let numCorrect = 0
		for (let r = 0; r < level; r++) {
			for (let c = 0; c < level; c++) {
				const tile = tiles.find(t => t.col === c && t.row === r)
				if (!tile || tile.id !== numCorrect) {
					return false
				}
				if (numCorrect === tiles.length - 1) return true
				numCorrect++
			}
		}
	}, [tiles])

    useEffect(() => {
		if (draggedTile) {
			setDraggedTile(null)
			resetOffsetValue()
		}

		if (status === 'playing' && resolveTiles()){
			setStatus('resolved')
		}
    }, [tiles])

    const shuffle = () => {
        const pile = [...tiles]
        let col = 0
        let row = 0
        const shuffled: TileType[] = []
        while (pile.length > 0) {
			const index = Math.floor(Math.random() * pile.length)
			const tile = pile.splice(index, 1)[0]
			const newTile = { ...tile, col, row }
			shuffled.push(newTile)
			col++
			if (col >= level) {
				col = 0
				row++
			}
        }
        
        setTiles(shuffled)
		setStatus('playing')
    }

	const startGame = () => {
		setStatus('start')
	}

	useEffect(() => {
		if (!status) return
		console.log('status', status)
		switch (status) {
		  case 'idle':
			initTiles()
			break
		  case 'start':
			shuffle()
			break
		  case 'playing':
			// setIsPaused(false)
			break
		  case 'paused':
			// setIsPaused(true)
			break
		  case 'resolved':
			// initTiles()
			break
		}
	  }, [status])

    // const getEmptyRow = () => {
    //     let emptyRow = null
    //     if (tiles) {
    //         for (let r = 0; r < level; r++) {
    //             const rowTiles = tiles.filter(t => t.row === r)
    //             if (rowTiles.length < level) emptyRow = r
    //         }
    //     }
    //     return emptyRow
    // }

    // const getEmptyCol = () => {
    //     let emptyCol = null
    //     if (tiles) {
    //         for (let c = 0; c < level; c++) {
    //             const colTiles = tiles.filter(t => t.col === c)
    //             if (colTiles.length < level) emptyCol = c
    //         }
    //     }
    //     return emptyCol
    // }
    
    // const getEmptySpace = () => {
    //     const col = getEmptyCol()
    //     const row = getEmptyRow()
    //     return (col !== null && row !== null) ? { col, row } : null
    // }

    const isTileDraggable = useCallback((tile: TileType) => {
		if (status !== 'playing' || !emptySpace) return false
        const { col, row } = emptySpace
        const draggables = tiles.filter(tile => tile.col === col || tile.row === row)
        return draggables.filter(t => t.id === tile.id).length > 0
    }, [emptySpace, tiles, status])

    const dragDirection = useMemo(() => {
        let direction: Direction = 'none'
        if (!emptySpace || !draggedTile) return direction
        
        const { col, row } = emptySpace
        if (draggedTile.col === col) {
            direction = draggedTile.row < row ? 'down' : 'up'
        } else if (draggedTile.row === row) {
            direction = draggedTile.col < col ? 'right' : 'left'
        }
        return direction
    }, [draggedTile])

	const isTileDragging = useCallback((tile: TileType) => {
		if (!draggedTile || !emptySpace) return false
        const { col, row } = emptySpace

		let draggingTiles = tiles.filter(t => (
			t.id === draggedTile.id ||
			(dragDirection === 'up' && t.col === col && t.row > row! && t.row < draggedTile.row) ||
			(dragDirection === 'down' && t.col === col && t.row < row && t.row > draggedTile.row) ||
			(dragDirection === 'left' && t.row === row && t.col > col! && t.col < draggedTile.col) ||
			(dragDirection === 'right' && t.row === row && t.col < col! && t.col > draggedTile.col)
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
		if (draggedTile) setEmptySpace({ col: draggedTile.col, row: draggedTile.row })
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
				case 'up': return { ...tile, row: tile.row - 1 }
				case 'down': return { ...tile, row: tile.row + 1 }
				case 'left': return { ...tile, col: tile.col - 1 }
				case 'right': return { ...tile, col: tile.col + 1 }
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
            ? dragDirection === 'left' ? -itemSize : itemSize
            : dragDirection === 'up' ? -itemSize : itemSize

        offset.value = withTiming(value, { duration: 100 }, () => finalizeMove())
    }

    const resetTile = () => {
        offset.value = withTiming(0, { duration: 100 }, onTileReset)
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

    const renderSquare = (id: number) => {
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
                }}
            >
                <Text style={styles.label}>{id + 1}</Text>
            </View>
        )
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
							backgroundColor: dragging ? 'purple' : draggable ? '#4682b4' : status === 'resolved' ? 'red' : 'green',
							cursor: draggable ? 'pointer' : 'auto',
						},
						dragging && animatedStyle,
					]}
				>
					<GestureDetector gesture={panGesture}>
						{renderSquare(tile.id)}
					</GestureDetector>
				</Animated.View>
			)
		})
    }

	const renderNavButton = () => {
		let onPress = () => {}
		switch (status) {
			case 'idle': onPress = startGame; break
			case 'playing': onPress = () => setStatus('paused'); break
			case 'paused': onPress = () => setStatus('playing'); break
			case 'resolved': onPress = startGame; break
		}
		let label
		switch (status) {
			case 'idle': label = 'Play'; break
			case 'playing': label = 'Pause'; break
			case 'paused': label = 'Resume'; break
			case 'resolved': label = 'Play Again'; break
		}
		return (
			<Button onPress={onPress} label={label} />
		)
	}
	const renderKillButton = () => status === 'paused' ? (
		<Button onPress={() => setStatus('idle')} label='Quit' />
	) : null

	const renderResolveMessage = () => status === 'resolved' ? (
		<Text style={[styles.status, { color: theme.colors.text }]}>Winner!</Text>
	) : null

    return (
        <View
            // style={styles.container}
			style={{ flex: 1 }}
        >
			<View
				onLayout={onLayout}
				style={styles.container}
			>
				{/* <CheckerBoard level={4} /> */}
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
			<Row spacing={20} paddingVertical={Size.M}>
				<Text style={[styles.status, { color: theme.colors.text }]}>{status}</Text>
				{renderNavButton()}
				{renderKillButton()}
				{renderResolveMessage()}
			</Row>
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
	status: {
		fontWeight: 'bold',
		fontSize: 20,
	},
})
