// constants

// field values
const EMPTY = 0;
const HUMAN = 1;
const COMPUTER = -1;

const MAX_HANDICAP = 100;

class Game {
  constructor(handicap, humanBegins = true) {
    this.handicap = 0 <= handicap < MAX_HANDICAP ? handicap : 10;

    this.turn = humanBegins ? HUMAN : COMPUTER;

    this.state = [
      [EMPTY, EMPTY, EMPTY],
      [EMPTY, EMPTY, EMPTY],
      [EMPTY, EMPTY, EMPTY],
    ];
  }

  playerMove(i, j) {
    if (this.turn !== HUMAN) {
      throw Error("it's not your turn!");
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
      throw Error("it's not my turn!");
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
      () => this._randomField(),
    ];

    while (action.length) {
      if (action.shift()()) {
        break;
      }
    }

    console.log(this.state);

    return this.gameFinished;
  }

  get getWinner() {}

  get getWinningLine() {}

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
    return false;
  }

  _avoidDefeat() {
    console.log("avoid defeat");

    const check = this._checkTriplet(2 * HUMAN);

    if (check.length) {
      const c = check[this._randInt(check.length)];

      if (0 <= c && c < 3) {
        // row
        const j = this._where(this.state[c], EMPTY)[0];
        this.state[c][j] = COMPUTER;
      } else if (3 <= c && c < 6) {
        // col
        const j = c - 3;
        console.log([0, 1, 2].map((i) => this.state[i][j]));
        const i = this._where(
          [0, 1, 2].map((i) => this.state[i][j]),
          EMPTY
        )[0];
        this.state[i][j] = COMPUTER;
      } else if (c === 6) {
        const s = this.state.flat();
        const x = this._where(
          [0, 4, 8].map((i) => s[i]),
          EMPTY
        )[0];
        this.state[x][x] = COMPUTER;
      } else {
        // secondary diagonal
        const s = this.state.flat();
        const x = this._where(
          [6, 4, 2].map((i) => s[i]),
          EMPTY
        )[0];
        this.state[2 - x][x] = COMPUTER;
      }

      return true;
    } else {
      return false;
    }
  }

  _matchball() {
    console.log("matchball");

    const acc = (x, y) => x + y;

    let rows = this._where(
      this.state.map((v) => v.reduce(acc)),
      COMPUTER
    );
    this._shuffle(rows);
    console.log(rows);

    for (let r = 0; r < rows.length; r++) {
      const i = rows[r];
      const empty = this._where(this.state[i], EMPTY);
      if (empty.length) {
        console.log("create matchball: find empty field in row");
        const j = empty[this._randInt(empty.length)];
        this.state[i][j] = COMPUTER;
        return true;
      }
    }

    let cols = this._where(
      [0, 1, 2].map((j) => [0, 1, 2].map((i) => this.state[i][j]).reduce(acc)),
      COMPUTER
    );
    this._shuffle(cols);

    console.log(cols);

    for (let c = 0; c < cols.length; c++) {
      let j = cols[c];
      const empty = this._where(
        [0, 1, 2].map((i) => this.state[i][j]),
        EMPTY
      );
      if (empty.length) {
        console.log("create matchball: find empty field in column");
        const i = empty[this._randInt(empty.length)];
        this.state[i][j] = COMPUTER;
        return true;
      }
    }

    return false;
  }

  _center() {
    console.log("play center");
    if (this.state[1][1] === EMPTY) {
      this.state[1][1] = COMPUTER;
      return true;
    } else {
      return false;
    }
  }

  _oppositeCorner() {
    const s = this.state.flat();

    if (s[0] + s[8] === HUMAN) {
      console.log("play opposite corner");
      if (this.state[0][0] === EMPTY) {
        this.state[0][0] = COMPUTER;
      } else {
        this.state[2][2] = COMPUTER;
      }
      return true;
    } else if (s[2] + s[6] === HUMAN) {
      console.log("play opposite corner");
      if (this.state[0][2] === EMPTY) {
        this.state[0][2] = COMPUTER;
      } else {
        this.state[2][0] = COMPUTER;
      }
      return true;
    } else {
      return false;
    }
  }

  _emptyCorner() {
    const c = [
      [0, 0],
      [0, 2],
      [2, 0],
      [2, 2],
    ];
    const e = this._where(
      [0, 2, 6, 8].map((v) => this.state.flat()[v]),
      EMPTY
    );

    if (e.length) {
      console.log("play empty corner");

      let i = this._randInt(e.length);
      this.state[c[e[i]][0]][c[e[i]][1]] = COMPUTER;
      return true;
    } else {
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
    } else {
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

  _shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  _checkTriplet(value) {
    const acc = (x, y) => x + y;

    const rows = this.state.map((v) => v.reduce(acc));
    const cols = [0, 1, 2].map((j) =>
      [0, 1, 2].map((i) => this.state[i][j]).reduce(acc)
    );

    const s = this.state.flat();
    const diag = [0, 4, 8].map((x) => s[x]).reduce(acc);
    const sdiag = [6, 4, 2].map((x) => s[x]).reduce(acc);

    return this._where(rows.concat(cols).concat([diag]).concat([sdiag]), value);
  }
}

export { EMPTY, HUMAN, COMPUTER, Game };
