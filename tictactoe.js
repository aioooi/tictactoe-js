const EMPTY = 0;
const HUMAN = 1;
const COMPUTER = -1;

class Game {
  constructor(handicap) {
    this.handicap = handicap;

    this.state = [
      [EMPTY, EMPTY, EMPTY],
      [EMPTY, EMPTY, EMPTY],
      [EMPTY, EMPTY, EMPTY]
    ]
  }

  // field status
  isEmpty(i, j) {
    return this.state[i][j] === EMPTY ? true : false;
  }

  isHuman(i, j) {
    return this.state[i][j] === HUMAN ? true : false;
  }

  isComputer(i, j) {
    return this.state[i][j] === COMPUTER ? true : false;
  }

  humanMove(i, j) {
    this.state[i][j] = HUMAN;
    console.log(this.state);
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

  _playField(i, j, player=HUMAN) {
    this.state[i][j] = player;
    console.log(this.state);
  }

  // strategies:
  _randomField() {
    const e = this._empty();
    let x = e[this._randInt(e.length)];
    this._playField(Math.floor(x / 3), x % 3, COMPUTER);
  }

  // helper
  _randInt(max) {
    return Math.floor(Math.random() * max);
  }
}

export { EMPTY, HUMAN, COMPUTER, Game };