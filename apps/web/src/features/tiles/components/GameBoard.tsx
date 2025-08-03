// apps/web/src/features/tiles/components/GameBoard.tsx

import React, { useCallback, useEffect, useState }  from 'react'
import { LayoutChangeEvent, StyleSheet, View } from 'react-native'
import { DraggableItem } from './DraggableItem'
import { Column } from '@shared/grid'
import { TileType } from '../types'

type GameBoardProps = {
    level: number
}

type BoardProps = {
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
    const [tiles, setTiles] = useState<TileType[]>()

    const initTiles = () => {
        const initialTiles: TileType[] = []
        let id = 0
        for (let row = 0; row < level; row++) {
            for (let col = 0; col < level; col++) {
                initialTiles.push({ id, row, col })
                id++
            }
        }
        const emptyTile = initialTiles.pop() as TileType
        setTiles(initialTiles)
    }

    useEffect(() => {
        console.log('tiles', tiles)
        console.log('emptyCol', getEmptyCol())
        console.log('emptyRow', getEmptyRow())
    }, [tiles])

    useEffect(() => {
        if (dims) {
            setItemSize(dims.width / level)
        }
    }, [dims])

    useEffect(() => {
        if (itemSize) {
            initTiles()
        }
    }, [itemSize])
    
    const getEmptyRow = useCallback(() => {
        let emptyRow
        if (tiles) {
            for (let r = 0; r < level; r++) {
                const rowTiles = tiles.filter(t => t.row === r)
                if (rowTiles.length < level) emptyRow = r
            }
        }
        return emptyRow
    }, [tiles])

    const getEmptyCol = useCallback(() => {
        let emptyCol
        if (tiles) {
            for (let c = 0; c < level; c++) {
                const colTiles = tiles.filter(t => t.col === c)
                if (colTiles.length < level) emptyCol = c
            }
        }
        return emptyCol
    }, [tiles])

    const getDraggableTile = (tile: TileType): TileType => {
        const col = getEmptyCol()
        const row = getEmptyRow()
        if (col == null || row == null) return tile
        let draggableTile
        if (tile.col === col) {
            draggableTile = { ...tile, direction: tile.row < row ? 'down' : tile.row > row ? 'up' : 'none' }
        } else if (tile.row === row) {
            draggableTile = { ...tile, direction: tile.col < col ? 'right' : tile.col > col ? 'left' : 'none' }
        } else {
            draggableTile = { ...tile, direction: 'none' }
        }
        return draggableTile as TileType
    }

    const getTiles = (tileArray: TileType[]): TileType[] => {
        return tileArray.map(t => getDraggableTile(t))
    }

    const onLayout = async (e: LayoutChangeEvent) => {
        const { layout } = e.nativeEvent
        if (!layout) return
        setDims({ width: layout.width, height: layout.height})
    }

    const updateTile = (tile: TileType) => {
        if (!tiles) return
        const updatedTiles = tiles.map((t) => {
            return t.id === tile.id
                ? tile
                : t
        })
        setTiles(getTiles(updatedTiles))
    }

    const onTileMoved = (tile: TileType) => {
        updateTile(tile)
    }

    const renderTiles = () => {
        if (!tiles || !itemSize) return null
        const tileArray = getTiles(tiles)
        return (
            <View style={styles.tileContainer}>
                {tileArray?.map((tile) => {
                    return (
                        <DraggableItem key={tile.id} size={itemSize} tile={tile} onMoved={onTileMoved} />
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

export const CheckerBoard: React.FC<BoardProps> = ({
    level,
}) => {
    
    const renderSquares = (odd: boolean) => {
        let index = 0
        const colors = ['#333', '#111']
        let squares = []
        let colorIndex = odd ? 0 : 1
        const getColor = () => {
            const color = colors[colorIndex]
            colorIndex = Math.abs(colorIndex - 1)
            return color
        }
        while (index < level) {
            squares.push (
                <View key={index} style={[styles.square, { backgroundColor: getColor() }]} />
            )
            index++
        }
        return squares
    }

    const renderRows = () => {
        const rows = []
        let index = 0
        while (index < level) {
            rows.push(
                <View key={index} style={styles.row}>
                    {renderSquares(index % 2 > 0)}
                </View>
            )
            index++
        }
        return (
            <Column flex={1}>
                {rows}
            </Column>
        )
    }
    
    return (
        <View style={styles.board}>
            {renderRows()}
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
})