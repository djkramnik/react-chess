import React, { useCallback, useMemo, useState } from 'react'

import type { ChessGameManager, GameState, Square, SquareState, ValidMove } from '../game'
import { ChessBoard, ChessBoardProps } from './board'

type PartialMove = [Square | null, Square | null]

export interface ChessGameProps {
  game: ChessGameManager<ValidMove>
  pieceSet: ChessBoardProps<SquareState>['pieceSet']
  handleMove: (state: GameState, move: ValidMove) => [GameState, Square | null, Square |  null]
  getChildren: (state: GameState, move: PartialMove) => JSX.Element | JSX.Element[]
}

export const ChessGame = ({
  game,
  pieceSet,
  handleMove,
  getChildren,
}: ChessGameProps) => {
  const [from, setFrom] = useState<Square | null>(null)
  const [to, setTo] = useState<Square | null>(null)
  const [boardState, setBoardState] = useState(game.state)

  const handleClick: Exclude<ChessBoardProps<SquareState>['handleClick'], 'undefined'>
    = useCallback((_: React.MouseEvent<HTMLButtonElement>, square: Square) => {
      if (from === null) {
        setFrom(square)
        return
      }
      if (to === null) {
        if (square === from) {
          return // trying to move to the same square is noop
        }
        setTo(square)
        return
      }
      const [s, f, t] = handleMove(boardState, `${from}-${to}` as ValidMove)
      setFrom(f)
      setTo(t)
      setBoardState(s)
    }, [
      from,
      to,
      boardState,
      handleMove,
      setFrom,
      setTo,
      setBoardState
    ])
  
  const children = useMemo(() =>
    getChildren(game.state, [from, to]), [getChildren, game.state, from, to])
  
  return (
    <div className="chessgame">
      <div className="chessgame-overlay" aria-hidden />
      <ChessBoard<SquareState>
        position={boardState.board}
        pieceSet={pieceSet}
        handleClick={handleClick}
      >
        {children}
      </ChessBoard>
    </div>
  )
}

// default implementation goes here