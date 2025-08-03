// apps/web/src/features/tiles/components/TileGame.tsx

import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react'
import { View as RNView, View, Text, Dimensions, Platform } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'
import { Gesture, GestureDetector, GestureHandlerRootView, GestureStateChangeEvent } from 'react-native-gesture-handler'
import { Button, useDeviceInfo } from '@shared/index'

// ----- Types -----

enum Direction {
    UP = 'up',
    DOWN = 'down',
    LEFT = 'left',
    RIGHT = 'right',
    NONE = 'none',
}

type TileType = {
  id: number
  col: number
  row: number
  direction: Direction
  dragging: boolean
}

type EmptySpace = {
    col: number
    row: number
}

type GameStatus = 'idle' | 'start' | 'playing' | 'paused' | 'resolved'

// ----- Tile Component -----
const Tile: React.FC<{
  label: number
  size: number
  dragging?: boolean
}> = ({ label, size, dragging }) => {
  return (
    <View
      style={{
        height: size,
        width: size,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: dragging ? '#ff8c00' : '#4682b4',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: dragging ? 0.7 : 0.3,
        shadowRadius: 5,
        elevation: dragging ? 8 : 2,
      }}
    >
      <Text style={{ fontSize: size / 3, color: 'white', fontWeight: 'bold' }}>{label}</Text>
    </View>
  )
}

// ----- Main TileGame Component -----
const TileGame: React.FC<{
    // gameSize: number
    // initialTiles: TileType[]
    // status: GameStatus
    // onChangeStatus: (status: GameStatus) => void
    // handleWin: () => void
    // level?: number
}> = () => {
    const { width: windowWidth } = useDeviceInfo()
    const gameSize = windowWidth * 0.9 // 90% width of screen
    const [level, setLevel] = useState(3)
    const [tiles, setTiles] = useState<TileType[]>([])
    // const [grid, setGrid] = useState<TileType[]>([])
    const [emptySpace, setEmptySpace] = useState<EmptySpace>()
    // const [itemSize, setItemSize] = useState(gameSize / level)
    const [isPaused, setIsPaused] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const [tilesLoaded, setTilesLoaded] = useState(false)
    const [status, setStatus] = useState<GameStatus>('idle')
    
    const handleWin = () => {
        alert('Congrats! You solved the puzzle!')
    }

    const isPlaying = useMemo(() => status === 'playing', [status])

  useEffect(() => {
    console.log(' ')
    console.log('gameSize', gameSize)
    // console.log('initialTiles', initialTiles)
    console.log('status', status)
    console.log('level', level)
    console.log(' ')
  }, [])

  const itemSize = gameSize / level
  // Calculate tile size on level/gameSize change
//   useEffect(() => {
//     // console.log('gameSize', gameSize)
//     // console.log('level', level)
//     setItemSize(gameSize / level)
//   }, [gameSize, level])

  // Handle status changes
  useEffect(() => {
    console.log('status', status)
    switch (status) {
      case 'idle':
        initTiles()
        break
      case 'start':
        startGame()
        break
      case 'playing':
        setIsPaused(false)
        break
      case 'paused':
        setIsPaused(true)
        break
      case 'resolved':
        initTiles()
        break
    }
  }, [status])

  const isTileDragging = (t: TileType) => {
    let dragging = null
    const draggedTiles = tiles.filter(t => t.dragging)
    if (draggedTiles.length) dragging = draggedTiles[0]
    return dragging
  }

  const getDraggedTiles = () => {
    return tiles.filter(t => isTileDragging(t))
  }

  // Shuffle tiles randomly for start
  const shuffle = () => {
    setRefreshing(true)
    console.log('shuffling...', tiles)
    const pile = [...tiles]
    console.log('...pile', pile)
    let col = 0
    let row = 0
    const shuffled: TileType[] = []
    while (pile.length > 0) {
      const index = Math.floor(Math.random() * pile.length)
      const tile = pile.splice(index, 1)[0]
      const newTile = { ...tile, col, row, direction: getTileDirection(tile), dragging: false }
      shuffled.push(newTile)
      col++
      if (col >= level) {
        col = 0
        row++
      }
    }
    
    console.log('shuffled', shuffled)
    const loadedTiles = getLoadedTiles(shuffled)
    // setRefreshing(true)
    setTiles(loadedTiles)
    setStatus('playing')
  }

  const getPositionFromTile = (tile: TileType) => {
    const { col, row } = tile
    return { col, row }
  }

  // Create initial tiles arranged in order
  const initTiles = () => {
    const initialTiles: TileType[] = []
    let id = 0
    for (let row = 0; row < level; row++) {
      for (let col = 0; col < level; col++) {
        initialTiles.push({ id, row, col, direction: Direction.NONE, dragging: false })
        id++
      }
    }

    // Remove the last tile to create empty space
    const emptyTile = initialTiles.pop() as TileType
    const space = getPositionFromTile(emptyTile)

    setTiles(initialTiles)

    setEmptySpace(space)

    // const directedTiles: TileType[] = initialTiles.map(t => {
    //     // if (emptyCol == null || emptyRow == null) return { ...t, direction: null }
    //     if (t.col === emptyCol) {
    //         return { ...t, direction: t.row < emptyRow ? 'down' : t.row > emptyRow ? 'up' : null }
    //     } else if (t.row === emptyRow) {
    //         return { ...t, direction: t.col < emptyCol ? 'right' : t.col > emptyCol ? 'left' : null }
    //     } else {
    //         return { ...t, direction: null }
    //     }
    // })
    // const response: TileType[] = initialTiles.map((t) =>( {...t, direction: getTileDirection(t, { col, row })}))
    
    // setEmptySpaceFromTile(emptyTile)
  }

  const getDirectionalTile = (t: TileType) => {
    return ({ ...t, direction: getTileDirection(t) })
  }

  const getLoadedTiles = (newTiles: TileType[]): TileType[] => {
    return newTiles.map(getDirectionalTile)
  }

//   const directedTiles = useMemo(() => {
//     return tiles.length ? tiles.map(t => getDirectedTile(t)) : null
//   }, [tiles])

//   const refreshTiles = (tileArray: TileType) => {

//   }

//   const getDirectedTile = (t: TileType): TileType => {
//     if (t.col === emptyCol) {
//         return { ...t, direction: t.row < emptyRow ? 'down' : t.row > emptyRow ? 'up' : null }
//     } else if (t.row === emptyRow) {
//         return { ...t, direction: t.col < emptyCol ? 'right' : t.col > emptyCol ? 'left' : null }
//     } else {
//         return { ...t, direction: null }
//     }
//   }

  const getTileDirection = (t: TileType): Direction => {
    if (!emptyCol || !emptyRow) return Direction.NONE
    let direction = Direction.NONE
    if (t.col === emptyCol) {
        direction = t.row < emptyRow ? Direction.DOWN : t.row > emptyRow ? Direction.UP : Direction.NONE
    } else if (t.row === emptyRow) {
        direction = t.col < emptyCol ? Direction.RIGHT : t.col > emptyCol ? Direction.LEFT : Direction.NONE
    }
    return direction
  }

  const getTilesWithDirection = (): TileType[] => {
    return tiles.map(t => ({ ...t, direction: getTileDirection(t) }))
  }

//   useEffect(() => {
//     console.log('grid', grid)
//   }, [grid])

//   const getDraggableTiles = (tileArray: TileType[]): TileType[] => {
//     return tileArray.map(t => {
//         if (emptyCol == null || emptyRow == null) return { ...t, direction: null }
//         if (t.col === emptyCol) {
//             return { ...t, direction: t.row < emptyRow ? 'down' : t.row > emptyRow ? 'up' : null }
//         } else if (t.row === emptyRow) {
//             return { ...t, direction: t.col < emptyCol ? 'right' : t.col > emptyCol ? 'left' : null }
//         } else {
//             return { ...t, direction: null }
//         }
//     })
//   }

//   const initTiles = () => {
//     console.log('initTiles...', initialTiles)
//     let col = 0
//     let row = 0
//     const tileArray: TileType[] = []
//     let index = 0
//     while (index < initialTiles.length) {
//       const newTile = { ...initialTiles[index], col, row, direction: null, dragging: false }
//       tileArray.push(newTile)
//       col++
//       if (col >= level) {
//         col = 0
//         row++
//       }
//       index++
//     }
//     console.log('tileArray', tileArray)
//     setTiles(tileArray)
//   }

//   useEffect(() => {
//     // if (itemSize)
//     // setRefreshing(true)
//         initTiles()
//     // assignDirections()
//   }, [])

  const startGame = useCallback(() => {
    shuffle()
  }, [shuffle])

  const getEmptyRow = () => {
    for (let r = 0; r < level; r++) {
        const rowTiles = tiles.filter(t => t.row === r)
        if (rowTiles.length < level) return r
    }
    return null
  }
//   Find empty cell position (row/col)
  const emptyRow = useMemo(() => tiles.length && getEmptyRow(), [tiles])

  const getEmptyCol = () => {
    for (let c = 0; c < level; c++) {
        const colTiles = tiles.filter(t => t.col === c)
        if (colTiles.length < level) return c
      }
      return null
  }

  const emptyCol = useMemo(() => tiles.length && getEmptyCol(), [tiles])

  const getEmpty = useMemo(() => ({
    col: emptyCol,
    row: emptyRow,
  }), [emptyCol, emptyRow])

//   useEffect(() => {
//     console.log('emptyCol', emptyCol)
//   }, [emptyCol])

//   useEffect(() => {
//     console.log('emptyRow', emptyRow)
//   }, [emptyRow])
  
    // const empty = useMemo(() => {
    //     const { col, row } = getEmpty
    //     // const row = getEmptyRow()
    //   if (col && row) {
    //       return { col, row }
    //     }
    //     return null
    // }, [emptyCol, emptyRow])
    
    useEffect(() => {
        console.log('emptySpace', emptySpace)
        if (emptySpace) {
            if (!tilesLoaded) setTilesLoaded(true)
            const loadedTiles = getLoadedTiles(tiles)
            // console.log('loadedFiles', loadedTiles)
            setTiles(loadedTiles)
        }
    }, [emptySpace])

    // useEffect(() => {
    //     if (!tiles?.length) return
    //     if (!tilesLoaded) {
    //         if (!tilesLoaded) setTilesLoaded(true)
    //         const loadedTiles = getLoadedTiles(tiles)
    //     console.log('loadedFiles', loadedFiles)
    //     }
    //     // if (!tilesLoaded) {
    //         // if (!tilesLoaded) 
    //         // setTilesLoaded(true)
    //         // else 
    //         // if (!refreshing) {
    //         //     setRefreshing(true)
    //         // }
    //     // } else {
    //     //     setTiles(tiles)
    //     // }
    // }, [tiles])

//   const emptyCol = useMemo(() => emptySpace && emptySpace?.col, [emptySpace])
//   const emptyRow = useMemo(() => emptySpace && emptySpace?.row, [emptySpace])

//   const empty = useMemo(() => tiles.length && { col: emptyCol, row: emptyRow }, [tiles])

  // Assign directions based on empty cell
//   const assignDirections = useCallback(() => {
//     setTiles(currTiles =>
//       currTiles.map(t => {
//         if (emptyCol == null || emptyRow == null) return { ...t, direction: null }
//         if (t.col === emptyCol) {
//           return { ...t, direction: t.row < emptyRow ? 'down' : t.row > emptyRow ? 'up' : null }
//         } else if (t.row === emptyRow) {
//           return { ...t, direction: t.col < emptyCol ? 'right' : t.col > emptyCol ? 'left' : null }
//         } else {
//           return { ...t, direction: null }
//         }
//       })
//     )
//   }, [emptyCol, emptyRow])

//   useEffect(() => {
//     if (!tiles || !tiles.length) return
//     setGrid(tiles.map(t => ({ ...t, direction: getTileDirection(t), dragging: false })))
//     // if (itemSize)
//     // if (tiles.length) {
//     //     assignDirections()
//     //     setTilesReady(true)
//     // }
//         // if (refreshing) {
//         // }
//   }, [tiles])


  // Run direction assignment whenever empty cell or tiles change
//   useEffect(() => {
//     assignDirections()
//   }, [emptyRow, emptyCol])

  // Check puzzle solved
  const resolveTiles = useCallback(() => {
    // if (!tiles.length) return false
    let numCorrect = 0
    for (let r = 0; r < level; r++) {
      for (let c = 0; c < level; c++) {
        const tile = tiles.find(t => t.col === c && t.row === r)
        if (!tile || tile.id !== numCorrect) return false
        numCorrect++
      }
    }
    return true
  }, [tiles])

  // Move tiles horizontally or vertically
  const moveTiles = useCallback(
    () => {
        let xOffset
        let yOffset
        const nextTiles = () => tiles.map(t => {
            if (!t.dragging) return t
            
            switch (t.direction) {
              case Direction.UP:
                yOffset = 0
                return { ...t, row: t.row - 1, dragging: false }
            case Direction.DOWN:
                yOffset = 1
                return { ...t, row: t.row + 1, dragging: false }
              case Direction.LEFT:
                xOffset = 0
                return { ...t, col: t.col - 1, dragging: false }
              case Direction.RIGHT:
                xOffset = 1
                return { ...t, col: t.col + 1, dragging: false }
              default:
                return t
            }
          })

          resetOffsetValues()
        const newTiles = nextTiles()
        setTiles(newTiles)
        // if (xOffset) offsetX.value = withTiming(xOffset, { duration: 0.5 }, () => setTiles(newTiles))
        // if (yOffset) offsetY.value = withTiming(yOffset, { duration: 0.5 }, () => setTiles(newTiles))
        //   setTiles(currTiles =>
    //     currTiles.map(t => {
    //       if (!t.dragging) return t
    //       switch (t.direction) {
    //         case Direction.UP:
    //           return { ...t, row: t.row - 1, dragging: false }
    //         case Direction.DOWN:
    //           return { ...t, row: t.row + 1, dragging: false }
    //         case Direction.LEFT:
    //           return { ...t, col: t.col - 1, dragging: false }
    //         case Direction.RIGHT:
    //           return { ...t, col: t.col + 1, dragging: false }
    //         default:
    //           return t
    //       }
    //     })
    //   )
    },
    []
  )

  const finishTileMove = () => {

  }

    const getMovedTiles = (direction: Direction) => {
        return tiles.map(t => {
            if (!t.dragging) return t
            switch (direction) {
                case Direction.UP:
                    return { ...t, row: t.row - 1, dragging: false }
                break
                case Direction.DOWN:
                    return { ...t, row: t.row + 1, dragging: false }
                    break
                case Direction.LEFT:
                    return { ...t, col: t.col - 1, dragging: false }
                    break
                case Direction.RIGHT:
                    return { ...t, col: t.col + 1, dragging: false }
                    break
                default: return t
            }
        })
    }

  // Set dragging tiles for a move
  const setDraggedTiles = useCallback(
    (tile: TileType) => {
      setTiles(currTiles => {
        return currTiles.map(t => {
          let dragging = false
          if (t.id === tile.id) dragging = true
          else if (t.col === emptyCol && tile.direction && (tile.direction === 'up' || tile.direction === 'down')) {
            dragging = tile.direction === 'up' ? t.row > emptyRow! && t.row < tile.row : t.row < emptyRow! && t.row > tile.row
          } else if (t.row === emptyRow && tile.direction && (tile.direction === 'left' || tile.direction === 'right')) {
            dragging = tile.direction === 'left' ? t.col > emptyCol! && t.col < tile.col : t.col < emptyCol! && t.col > tile.col
          }
          return { ...t, dragging }
        })
      })
    },
    [tiles]
  )

  const startDragTile = (tile: TileType) => {
    const draggedTiles = tiles.map(t => {
        let dragging = false
        if (t.id === tile.id) dragging = true
        else if (t.col === emptyCol && tile.direction && (tile.direction === 'up' || tile.direction === 'down')) {
          dragging = tile.direction === 'up' ? t.row > emptyRow! && t.row < tile.row : t.row < emptyRow! && t.row > tile.row
        } else if (t.row === emptyRow && tile.direction && (tile.direction === 'left' || tile.direction === 'right')) {
          dragging = tile.direction === 'left' ? t.col > emptyCol! && t.col < tile.col : t.col < emptyCol! && t.col > tile.col
        }
        return { ...t, dragging }
    })
    setTiles(draggedTiles)
  }

  // Gesture handlers
  const onTouchStart = useCallback(
    (tile: TileType) => {
      if (status !== 'playing') return
      if (tile.direction) {
        setIsDragging(true)
        startDragTile(tile)
        // setIsDragging(true)
        // // setDraggedTiles(tile)
        // setDragged(tile)
      }
    },
    [status]
  )

  const setDragged = (tile: TileType) => {
    setTiles(currTiles => {
        return currTiles.map(t => {
          let dragging = false
          if (t.id === tile.id) dragging = true
          else if (t.col === emptyCol && tile.direction && (tile.direction === 'up' || tile.direction === 'down')) {
            dragging = tile.direction === 'up' ? t.row > emptyRow! && t.row < tile.row : t.row < emptyRow! && t.row > tile.row
          } else if (t.row === emptyRow && tile.direction && (tile.direction === 'left' || tile.direction === 'right')) {
            dragging = tile.direction === 'left' ? t.col > emptyCol! && t.col < tile.col : t.col < emptyCol! && t.col > tile.col
          }
          return { ...t, dragging }
        })
      })
    // setTiles(currTiles => {
    //     return currTiles.map(t => t.id === tile.id ? { ...t, dragging: true } : { ...t, dragging: false })
    // })
  }

  const onTouchMove = useCallback(
    (event: any, tile: TileType, offsetX: any, offsetY: any) => {
      if (!isPaused && isDragging) {
        const { translationX, translationY } = event
        switch (tile.direction) {
          case 'up':
            if (translationY >= -itemSize && translationY <= 0) offsetY.value = translationY
            break
          case 'down':
            if (translationY <= itemSize && translationY >= 0) offsetY.value = translationY
            break
          case 'left':
            if (translationX >= -itemSize && translationX <= 0) offsetX.value = translationX
            break
          case 'right':
            if (translationX <= itemSize && translationX >= 0) offsetX.value = translationX
            break
        }
      }
    },
    [isDragging, itemSize]
  )

  const clearDrag = () => {
    setTiles(currTiles => currTiles.map(t => ({ ...t, dragging: false })))
    setIsDragging(false)
  }

//   useEffect(() => {
//     if (!isDragging) {
//         clearDrag()
//     }
//   }, [isDragging])

    const offsetX = useSharedValue(0)
    const offsetY = useSharedValue(0)

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: offsetX.value }, { translateY: offsetY.value }],
    }))

    const resetOffsetValues = () => {
		offsetX.value = 0
		offsetY.value = 0
	}

const resetTiles = () => {
    // offsetX.value = withTiming(0, { duration: .25 })
    offsetX.value = withTiming(1, { duration: .5}, moveTiles)
    offsetY.value = withTiming(1, { duration: .5}, moveTiles)
}

  const onTouchEnd = useCallback(
    (event: any, tile: TileType) => {
        let finishMove = shouldFinishMove(event, tile)
        if (finishMove) {
            offsetX.value = withTiming(1, { duration: .5}, moveTiles)
            offsetY.value = withTiming(1, { duration: .5}, moveTiles)
            // const newTiles = getMovedTiles(tile.direction)
            // moveTiles(tile.direction)
            // setTiles(newTiles)
            // const movedTiles = moveTiles(tile.direction)
            // setTiles(movedTiles)
        } else {
            resetTiles()
        }
        // clearDrag()
        // moveTiles(tile.direction!)
    },
    [isDragging]
  )

  const getSwipeEvent = (event: GestureStateChangeEvent) => {
      const { velocityX, velocityY } = event
      let swipeX = false
      let swipeY = false
      if (event.velocityY as number > 1000) swipeY = true
      else if (event.velocityX as number > 1000) swipeX = true
      if (swipeX) return 'horizontal'
      else if (swipeY) return 'vertical'
      else return null
  }

  const shouldFinishMove = (event: GestureStateChangeEvent, tile: TileType) => {
    const swipe = getSwipeEvent(event)
    const moveThreshold = itemSize / 2
    const moveY = Math.abs(event.translationY as number) > moveThreshold
    const moveX = Math.abs(event.translationX as number) > moveThreshold
    if (swipe) {
        if (swipe === 'horizontal' && moveX) return true
        else if (swipe === 'vertical' && moveY) return true
    }
    const isVertical = (tile.direction === 'up' || tile.direction === 'down')
    return ((!isVertical && moveX) || (isVertical && moveY))
}

    // After moving tiles, check puzzle status
    // useEffect(() => {
    //     // console.log('refreshing', refreshing)
    //     // if (refreshing) {
    //         if (status === 'playing') {
    //             if (resolveTiles()) {
    //                 handleWin()
    //                 setStatus('resolved')
    //             // } else {
    //             //     assignDirections()
    //             }
    //         }
    //     // }
    // }, [refreshing, status, resolveTiles, handleWin])

  // Render tiles with gesture support
  const renderTiles = () => {
    return tiles.map((t: TileType) => {
        console.log('rendered tile -->', t)

      const panGesture = Gesture.Pan()
        .onBegin(() => onTouchStart(t))
        .onChange(e => onTouchMove(e, t, offsetX, offsetY))
        .onFinalize(e => {
          offsetX.value = 0
          offsetY.value = 0
          onTouchEnd(e, t)
        })

        // const currentTile = {
        //     ...t,
        //     direction: getTileDirection(t),
        // }

        return (
          <RNView
            key={`tile-${t.id}`}
            style={{
              position: 'absolute',
              top: t.row * itemSize,
              left: t.col * itemSize,
              height: itemSize,
              width: itemSize,
            //   overflow: 'hidden',
            //   borderRadius: 10,
            //   borderWidth: 1,
            //   borderColor: 'blue',
            //   ...(Platform.OS === 'web' ? { cursor: t.direction ? 'pointer' : 'default' } : {}),
            }}
          >
            <Animated.View
              style={[
                {
                  height: itemSize,
                  width: itemSize,
                  backgroundColor: t.dragging ? '#ff8c00' : '#4682b4',
                  borderRadius: 10,
                  overflow: 'hidden',
                },
                t.dragging ? animatedStyle : null,
              ]}
            >
              <GestureDetector gesture={panGesture}>
                <Tile label={t.id + 1} size={itemSize} dragging={t.dragging} />
              </GestureDetector>
            </Animated.View>
          </RNView>
        )        
    })
  }

  return (
    // <GestureHandlerRootView>
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Button
            label='Start'
            onPress={() => setStatus('start')}
        />
        {tilesLoaded && (
            <View
                style={{
                    width: gameSize,
                    height: gameSize,
                    position: 'relative',
                }}
            >
                {/* {tiles.length && renderTiles()} */}
                {/* {tiles && renderTiles()} */}
                {tilesLoaded && renderTiles()}
            </View>
        )}

    </View>
    // </GestureHandlerRootView>
  )
}

// ----- Parent Component: Tiles Container -----
// const Tiles: React.FC = () => {
// //   const windowWidth = Dimensions.get('window').width

//   // Create initial tiles arranged in order
// //   const initialTiles: TileType[] = useMemo(() => {
// //     const tiles: TileType[] = []
// //     let id = 0
// //     for (let row = 0; row < level; row++) {
// //       for (let col = 0; col < level; col++) {
// //         tiles.push({ id, row, col, direction: null })
// //         id++
// //       }
// //     }
// //     // Remove the last tile to create empty space
// //     tiles.pop()
// //     return tiles
// //   }, [level])

// //   const [status, setStatus] = useState<GameStatus>('idle')

//   // Handle user winning the puzzle
// //   const handleWin = () => {
// //     alert('Congrats! You solved the puzzle!')
// //   }

//   // Start game on mount or on status idle
// //   useEffect(() => {
// //     console.log('STATUS', status)
// //     if (status === 'idle') {
// //     //   setStatus('start')
// //     }
// //   }, [status])

// //   const handleStatusChange = (value: GameStatus) => {
// //     if (value !== status) setStatus(value)
// //   }

//   return (
//       <TileGame
//         // gameSize={gameSize}
//         // initialTiles={initialTiles}
//         // status={status}
//         // onChangeStatus={handleStatusChange}
//         // handleWin={handleWin}
//         // level={level}
//       />
//   )
// }

export default TileGame
