type SquareState =
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

type Square = `${Rank}${File}`
type Move = `${Square}-${Square}`

type Result = 1 | 0 | -1

interface GameState {
  board: SquareState[]
  castling: `${OneOrZero}${OneOrZero}${OneOrZero}${OneOrZero}` // wk, wq, bk, bq
  enpassant: number | null
  fiftyMove: number
  history: Move[]
  turn: OneOrZero
  result: Result | null
}

interface ChessGame {
  state: GameState
  next: (move: Move) => GameState | null
  endGame: (r: Result) => GameState
  reset: () => GameState
}

interface Rules {
  next: (move: Move) => GameState | null
  validate?: (state: GameState) => boolean
}  

interface GetChessGame {
  rules: Rules
  initial: GameState
}

export const getChessGame = ({
  rules,
  initial,
}: GetChessGame): ChessGame | null => {
  if (rules.validate?.(initial) === false) {
    return null
  }

  let state: GameState = {
    ...initial,
    board: initial.board.slice(0),
    history: initial.history.slice(0),
  }

  return {
    state,
    next,
    endGame,
    reset,
  }

  function next(move: Move): GameState | null {
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
      board: initial.board.slice(0),
      history: initial.history.slice(0),
    }
    return state
  }
}