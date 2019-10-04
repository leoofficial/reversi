const WHITE_DISC = '\u25CB';
const BLACK_DISC = '\u25CF';

class Reversi {

  constructor(board = undefined, blackDiscJustMoved = undefined) {
    if (board && blackDiscJustMoved !== undefined) {
      this.board = board;
      this.blackDiscJustMoved = blackDiscJustMoved
    } else {
      this.board = Array(8).fill(null).map(() => Array(8).fill(null));
      this.board[3][3] = this.board[4][4] = WHITE_DISC;
      this.board[3][4] = this.board[4][3] = BLACK_DISC;
      this.blackDiscJustMoved = false;
    }
  }

  doMove(move) {
    let [x, y] = [move[0], move[1]];
    let playerToMove = this.playerToMove();
    this.board[x][y] = playerToMove;
    for (let [u, v] of this.sandwichedDiscsAt(x, y)) this.board[u][v] = playerToMove;
    this.blackDiscJustMoved = !this.blackDiscJustMoved;
  }

  nextMoves() {
    let indices = Array.from(Array(8).keys());
    return [].concat(...indices.map(x => indices.map(y => [].concat(x, y))))
      .filter(move => !this.board[move[0]][move[1]] && this.existSandwichedDiscsAt(move[0], move[1]))
  }

  quantifiableOutcome(player) {
    let opponent = player === BLACK_DISC ? WHITE_DISC : BLACK_DISC;
    let board = this.board.flat();
    let discsPlayer = board.filter(disc => disc === player).length;
    let discsOpponent = board.filter(disc => disc === opponent).length;
    return discsPlayer === discsOpponent ? 0.5 : discsPlayer < discsOpponent ? 0 : 1;
  }

  sandwichedDiscsAt(x, y) {
    let sandwichedDiscs = [];
    for (let [dx, dy] of this.adjacentOpponentDirections(x, y)) sandwichedDiscs.push(...this.sandwichedDiscsAlong(x, y, dx, dy));
    return sandwichedDiscs;
  }

  adjacentOpponentDirections(x, y) {
    let playerJustMoved = this.playerJustMoved();
    let directions = [];
    for (let [dx, dy] of [[0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1], [1, 0], [1, 1]]) {
      if (Reversi.isOnBoard(x + dx, y + dy) && this.board[x + dx][y + dy] === playerJustMoved) directions.push([dx, dy]);
    }
    return directions;
  }

  sandwichedDiscsAlong(x, y, dx, dy) {
    let playerJustMoved = this.playerJustMoved();
    let sandwichedDiscs = [];
    x = x + dx;
    y = y + dy;
    while (Reversi.isOnBoard(x, y) && this.board[x][y] === playerJustMoved) {
      sandwichedDiscs.push([x, y]);
      x = x + dx;
      y = y + dy;
    }
    return Reversi.isOnBoard(x, y) && this.board[x][y] === this.playerToMove() ? sandwichedDiscs : []
  }

  existSandwichedDiscsAt(x, y) {
    for (let [dx, dy] of this.adjacentOpponentDirections(x, y)) {
      if (this.sandwichedDiscsAlong(x, y, dx, dy).length) return true;
    }
    return false;
  }

  playerJustMoved() {
    return this.blackDiscJustMoved ? BLACK_DISC : WHITE_DISC;
  }

  playerToMove() {
    return this.blackDiscJustMoved ? WHITE_DISC : BLACK_DISC;
  }

  static isOnBoard(x, y) {
    return x >= 0 && x < 8 && y >= 0 && x < 8
  }
}

export default Reversi;
