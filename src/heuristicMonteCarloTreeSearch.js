function heuristicMonteCarloTreeSearch(rootState, heuristic, maxIter) {

  class Node {

    constructor(state = undefined, move = undefined, parentNode = undefined) {
      this.nextMoves = state.nextMoves();
      this.playerJustMoved = state.playerJustMoved();
      this.move = move;
      this.parentNode = parentNode;
      this.childNodes = [];
      this.wins = 0;
      this.visits = 0;
    }

    nextNode() {
      return this.childNodes.sort((prevNode, currNode) =>
        (currNode.wins / currNode.visits + Math.sqrt(2 * Math.log(this.visits) / currNode.visits)) -
        (prevNode.wins / prevNode.visits + Math.sqrt(2 * Math.log(this.visits) / prevNode.visits)))
        .slice(0, Math.ceil(this.childNodes.length / 3))
        .reduce((prevNode, currNode) => heuristic(prevNode.move) <= heuristic(currNode.move) ? prevNode : currNode);
    }

    expand(move, state) {
      let node = new Node(state, move, this);
      this.nextMoves = this.nextMoves.filter(next => next[0] !== move[0] || next[1] !== move[1]);
      this.childNodes.push(node);
      return node;
    }

    update(self, outcome) {
      this.wins = this.wins + outcome;
      this.visits = this.visits + 1;
    }
  }

  let root = new Node(rootState);
  for (let i = 0; i < maxIter; i++) {
    let node = root;
    let state = Object.assign(Object.create(rootState), rootState);
    while (!node.nextMoves.length && node.childNodes.length) {
      node = node.nextNode();
      state.doMove(node.move);
    }
    if (node.nextMoves.length) {
      let move = node.nextMoves[Math.floor(Math.random() * node.nextMoves.length)];
      state.doMove(move);
      node = node.expand(move, state);
    }
    let nextMoves = state.nextMoves();
    while (nextMoves.length) {
      state.doMove(nextMoves[Math.floor(Math.random() * nextMoves.length)]);
      nextMoves = state.nextMoves();
    }
    while (node) {
      node.update(state.quantifiableOutcome(node.playerJustMoved));
      node = node.parentNode;
    }
  }
  return root.childNodes.reduce((prevNode, currNode) => prevNode.visits > currNode.visits ? prevNode : currNode).move;
}

export default heuristicMonteCarloTreeSearch;
