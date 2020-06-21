// constants

// field values
const EMPTY = 0;
const HUMAN = 1;
const COMPUTER = -1;

const MAX_HANDICAP = 100;

class Game {
  constructor(handicap, firstMove = HUMAN) {
    this.handicap = (0 <= handicap < MAX_HANDICAP) ? handicap : 10;

    this.turn = firstMove !== HUMAN ? COMPUTER : firstMove;

    this.state = [
      [EMPTY, EMPTY, EMPTY],
      [EMPTY, EMPTY, EMPTY],
      [EMPTY, EMPTY, EMPTY]
    ]
  }


  playerMove(i, j) {
    if (this.turn !== HUMAN) {
      throw Error("it's not your turn!")
    }

    if (this.state[i][j] !== EMPTY) {
      throw Error("field not empty!");
    }

    this.state[i][j] = HUMAN;
    this.turn = COMPUTER;
    return this.gameFinished();
  }

  makeMove() {
    if (this.turn !== COMPUTER) {
      throw Error("it's not my turn!")
    }

    // make move
    let action = [
      this._randomField,
    ]

    while (action.length) {
      if (action.pop()()) {
        break;
      }
    }

    return this.gameFinished();
  }

  get getWinner() {

  }

  get getWinningLine() {

  }

  get gameFinished() {
    // check board whether board complete
    // determine winner
  }

  // field status, TODO do I need those methods?
  isEmpty(i, j) {
    return this.state[i][j] === EMPTY ? true : false;
  }

  isHuman(i, j) {
    return this.state[i][j] === HUMAN ? true : false;
  }

  isComputer(i, j) {
    return this.state[i][j] === COMPUTER ? true : false;
  }


  // strategies
  _randomField() {
    const e = this._empty();
    if (e.length) {
      let x = e[this._randInt(e.length)];
      this._playField(Math.floor(x / 3), x % 3, COMPUTER);
      return true;
    }
    else {
      return false;
    }
  }


  // helpers
  _randInt(max) {
    return Math.floor(Math.random() * max);
  }

  // indices of state.flat() where === EMPTY
  _empty() {
    let e = [];
    this.state.flat().forEach((v, i) => {
      if (v === EMPTY) {
        e.push(i);
      }
    });
    return e;
  }
}

export { EMPTY, HUMAN, COMPUTER, Game };