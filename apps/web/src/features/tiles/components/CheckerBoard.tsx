// apps/web/src/features/tiles/components/CheckerBoard.tsx

import React  from 'react'
import { StyleSheet, View } from 'react-native'
import { Column } from '@shared/grid'

type CheckerBoardProps = {
    level: number
}

export const CheckerBoard: React.FC<CheckerBoardProps> = ({
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
})