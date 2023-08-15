
import React from 'react'
import { SquareState } from '../game'
import { cx } from './util'

export interface Piece<T extends SquareState> {
  name: string
  type: T
  value?: number
}

export type PieceSet<T extends SquareState> = {
  [PieceType in keyof Record<T, null>]: Piece<PieceType> & {
    path: string
  }
}

export type ChessPieceProps <T extends SquareState> = {
  piece: PieceSet<T>[T]
  className?: string
}

export const ChessPiece = <T extends SquareState>({
  piece: {
    name,
    path,
  },
  className,
}: ChessPieceProps<T>) => {
  return (
    <div className={cx(['piece', className])}>
      <div className="piece-overlay" aria-hidden />
      <img src={path} alt={name} />
    </div>
  )
}