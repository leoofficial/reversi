import React from 'react';
import Reversi from './reversi'
import heuristicMonteCarloTreeSearch from './heuristicMonteCarloTreeSearch'
import './App.css';

function Square(props) {
  return (
    <button className="square" onClick={ props.onClick }>
      { props.value }
    </button>
  );
}

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { reversi: new Reversi() };
  }

  componentDidUpdate(prevProps, prevState, nextContext) {
    setTimeout(() => {
      requestAnimationFrame(() => {
        if (this.state.reversi.blackDiscJustMoved) {
          let reversi = Object.assign(Object.create(this.state.reversi), this.state.reversi);
          reversi.doMove(heuristicMonteCarloTreeSearch(new Reversi(JSON.parse(JSON.stringify(reversi.board)), true), move => Math.min(move[0], 7 - move[0]) + Math.min(move[1], 7 - move[1]), 50000));
          this.setState({ reversi: reversi });
        }
      });
    });
  }

  doMove(move) {
    let reversi = Object.assign(Object.create(this.state.reversi), this.state.reversi);
    if (!reversi.nextMoves().some(nextMove => move.every((component, index) => component === nextMove[index]))) return;
    reversi.doMove(move);
    this.setState({ reversi: reversi });
  }

  render() {
    let quantifiableOutcome = this.state.reversi.quantifiableOutcome(this.state.reversi.playerJustMoved());
    return (
      <div>
        <div className="game-info">REVERSI</div>
        <div className="game-board">
          {
            Array(8).fill(null).map(() => Array(8).fill(null)).map((row, x) => (
                <div key={ 64 + x } className="board-row">
                  { row.map((value, y) => <Square key={ 8 * x + y } value={ this.state.reversi.board[x][y] } onClick={ () => this.doMove([x, y]) } />) }
                </div>
              )
            )
          }
        </div>
        <div  className="game-info">
          {
            this.state.reversi.nextMoves().length ? `NEXT PLAYER ${ this.state.reversi.playerToMove() }`
              : quantifiableOutcome === 0.5 ? 'DRAW'
              : `${ quantifiableOutcome === 1 ? this.state.reversi.playerJustMoved() : this.state.reversi.playerToMove() } WINS`
          }
        </div>
        <div className="game-info">
          <button className="game-info" style={{ marginBottom: 0 }} onClick={ () => this.setState({ reversi: new Reversi() }) }>NEW GAME</button>
        </div>
      </div>
    );
  }
}

export default App;
