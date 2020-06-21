// constants

// field values
const EMPTY = 0;
const HUMAN = 1;
const COMPUTER = -1;

const MAX_HANDICAP = 100;

class Game {
  constructor(handicap, humanBegins = true) {
    this.handicap = (0 <= handicap < MAX_HANDICAP) ? handicap : 10;

    this.turn = humanBegins ? HUMAN : COMPUTER;

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
    console.log("human move done");
    return this.gameFinished;
  }

  makeMove() {
    if (this.turn !== COMPUTER) {
      throw Error("it's not my turn!")
    }
    this.turn = HUMAN;

    console.log("computer moves");

    // make move
    let action = [
      () => this._win(),
      () => this._avoidDefeat(),
      () => this._matchball(),
      () => this._center(),
      () => this._oppositeCorner(),
      () => this._emptyCorner(),
      () => this._randomField()
    ]
    
    while (action.length) {
      if (action.shift()()) {
        break;
      }
    }
    
    console.log(this.state)
    
    return this.gameFinished;
  }
  
  get getWinner() {
    
  }
  
  get getWinningLine() {
    
  }
  
  get gameFinished() {
    return false;
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
  _win() {

  }
  
  _avoidDefeat() {

  }

  _matchball() {

  }

  _center() {
    console.log("play center");
    if (this.state[1][1] === EMPTY) {
      this.state[1][1] = COMPUTER;
      return true;
    }
    else {
      return false;
    }
  }
  
  _oppositeCorner() {
    const s = this.state.flat()
    
    if (s[0] + s[8] === HUMAN) {
      console.log("play opposite corner");
      if (this.state[0][0] === EMPTY) {
        this.state[0][0] = COMPUTER;
      }
      else {
        this.state[2][2] = COMPUTER;
      }
      return true;
    }
    else if (s[2] + s[6] === HUMAN) {
      console.log("play opposite corner");
      if (this.state[0][2] === EMPTY) {
        this.state[0][2] = COMPUTER;
      }
      else {
        this.state[2][0] = COMPUTER;
      }
      return true;
    }
    else {
      return false;
    }
  }
  
  _emptyCorner() {
    const c = [[0, 0], [0, 2], [2, 0], [2, 2]];
    const e = this._where([0, 2, 6, 8].map(v => this.state.flat()[v]), EMPTY);
    
    if (e.length) {
      console.log("play empty corner");
      
      let i = this._randInt(e.length);
      this.state[c[e[i]][0]][c[e[i]][1]] = COMPUTER;
      return true;
    }
    else {
      return false;
    }
  }
  
  _randomField() {
    const e = this._where(this.state.flat(), EMPTY);
    if (e.length) {
      console.log("play random field");

      let x = e[this._randInt(e.length)];
      this.state[Math.floor(x / 3)][x % 3] = COMPUTER;
      return true;
    }
    else {
      return false;
    }
  }


  // helpers
  _randInt(max) {
    return Math.floor(0.99999 * Math.random() * max);
  }

  _where(array, value) {
    let e = [];
    array.forEach((v, i) => {
      if (v === value) {
        e.push(i);
      }
    });
    return e;
  }
}

export { EMPTY, HUMAN, COMPUTER, Game };