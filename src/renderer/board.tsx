import React, {useMemo} from 'react'
import type { SquareState, GameState, Square } from '../game'
import { cx } from './util'
import { ChessPiece } from './piece'
import type { PieceSet } from './piece'

export interface ChessBoardProps<T extends SquareState> {
  pieceSet: PieceSet<T>
  position: GameState<T>['board']
  children?: React.ReactNode
  handleClick?: (event: React.MouseEvent<HTMLButtonElement>, square: Square) => void
}

export const ChessBoard = <T extends SquareState>({
  pieceSet,
  position,
  children,
  handleClick
}: ChessBoardProps<T>) => {
  const chessBoard = useMemo(() => (
    <div className="board">
      <div className="board-overlay" aria-hidden>
        {children}
      </div>
      {
        (Object.entries(position) as Array<[Square, SquareState]>)
          .filter(([,v]) => v !== '0')
          .map(([k,v]: [Square, SquareState]) => {
            return (
              <button
                key={k} 
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleClick?.(event, k)}
                aria-description={`chess piece type ${v} on ${k}`}
                className={cx(['boardpiece', ...k.split('')])}
                type="button">
                <ChessPiece {...pieceSet[v]} />
              </button>
            )
          })
      }
    </div>
  ), [pieceSet, position, children, handleClick])
  
  return chessBoard
}