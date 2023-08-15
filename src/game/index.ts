export type SquareState =
  | '0'
  | 'p'
  | 'n'
  | 'b'
  | 'r'
  | 'q'
  | 'k'
  | 'P'
  | 'N'
  | 'B'
  | 'R'
  | 'Q'
  | 'K'

type OneOrZero =
  | 0
  | 1

type Rank = | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8'
type File = | 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h'

export type Square = `${File}${Rank}`
export type Move = `${Square}-${Square}`
export type InvalidMove = {
  [S in keyof Record<Square, null>]: `${S}-${S}`
}
export type ValidMove = Exclude<Move, InvalidMove>

type Result = 1 | 0 | -1

export interface GameState<T extends SquareState = SquareState, S extends Square = Square> {
  board: Record<S, T>
  castling: `${OneOrZero}${OneOrZero}${OneOrZero}${OneOrZero}` // wk, wq, bk, bq
  enpassant: number | null
  fiftyMove: number
  history: Move[]
  turn: OneOrZero
  result: Result | null
}

export interface ChessGameManager<M extends Move = Move> {
  state: GameState
  next: (move: M) => GameState | null
  endGame: (r: Result) => GameState
  reset: () => GameState
}

interface Rules<M extends Move> {
  next: (move: M) => GameState | null
  validate?: (state: GameState) => boolean
}  

interface GetChessGame<M extends Move> {
  rules: Rules<M>
  initial: GameState
}

export const getChessGame = <M extends Move = ValidMove>({
  rules,
  initial,
}: GetChessGame<M>): ChessGameManager<M> | null => {
  if (rules.validate?.(initial) === false) {
    return null
  }

  let state: GameState = {
    ...initial,
    board: {...initial.board},
    history: initial.history.slice(0),
  }

  return {
    state,
    next,
    endGame,
    reset,
  }

  function next(move: M): GameState | null {
    const nextState = rules.next(move)
    if (nextState !== null) {
      state = nextState
      return state
    }
    return null
  }

  function endGame(r: Result) {
    state.result = r
    return state
  }

  function reset() {
    state = {
      ...initial,
      board: {...initial.board},
      history: initial.history.slice(0),
    }
    return state
  }
}