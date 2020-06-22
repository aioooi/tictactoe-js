// constants

// field values
const EMPTY = 0;
const PLAYER = 1;
const COMPUTER = -1;

const MAX_HANDICAP = 100;

class Game {
  constructor(handicap, playerBegins = true) {
    this.handicap = 0 <= handicap && handicap < MAX_HANDICAP ? handicap : 10;

    this.turn = playerBegins ? PLAYER : COMPUTER;

    this.state = [
      [EMPTY, EMPTY, EMPTY],
      [EMPTY, EMPTY, EMPTY],
      [EMPTY, EMPTY, EMPTY],
    ];
  }

  playerMove(i, j) {
    if (this.turn !== PLAYER) {
      throw Error("it's not your turn!");
    }

    if (this.state[i][j] !== EMPTY) {
      throw Error("field not empty!");
    }

    this.state[i][j] = PLAYER;
    this.turn = COMPUTER;
    console.log("player move done");
    return this.gameFinished;
  }

  makeMove() {
    if (this.turn !== COMPUTER) {
      throw Error("it's not my turn!");
    }
    this.turn = PLAYER;

    console.log("computer moves");

    if (this._randInt(MAX_HANDICAP) < this.handicap) {
      this._randomMove();
    } else {
      let action = [
        () => this._win(),
        () => this._avoidDefeat(),
        () => this._matchball(),
        () => this._center(),
        () => this._oppositeCorner(),
        () => this._emptyCorner(),
        () => this._randomMove(),
      ];

      while (action.length) {
        if (action.shift()()) {
          break;
        }
      }
    }

    console.log(this.state);

    return this.gameFinished;
  }

  get getWinner() {
    return this.winner;
  }

  get getWinningLine() {
    return this.winningLine;
  }

  get gameFinished() {
    const check = [
      this._checkTriplet(3 * COMPUTER),
      this._checkTriplet(3 * PLAYER),
      this._where(this.state.flat(), EMPTY).length === 0,
    ];

    const winningLine = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [6, 4, 2],
    ];

    if (check[0].length) {
      console.log("computer wins");
      this.winner = COMPUTER;
      this.winningLine = winningLine[check[0][0]];
      return true;
    } else if (check[1].length) {
      console.log("player wins");
      this.winner = PLAYER;
      this.winningLine = winningLine[check[1][0]];
      return true;
    } else if (check[2] && !(check[0].length || check[1].length)) {
      console.log("that's a draw");
      this.winner = EMPTY;
      return true;
    } else {
      return false;
    }
  }

  // strategies
  _win() {
    return this._fillTriplet(2 * COMPUTER, "win");
  }

  _avoidDefeat() {
    return this._fillTriplet(2 * PLAYER, "avoid defeat");
  }

  _fillTriplet(check_value, message) {
    const check = this._checkTriplet(check_value);

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

      console.log(message);
      return true;
    } else {
      return false;
    }
  }

  _matchball() {
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
    if (this.state[1][1] === EMPTY) {
      console.log("play center");
      this.state[1][1] = COMPUTER;
      return true;
    } else {
      return false;
    }
  }

  _oppositeCorner() {
    const s = this.state.flat();

    if (s[0] + s[8] === PLAYER) {
      console.log("play opposite corner");
      if (this.state[0][0] === EMPTY) {
        this.state[0][0] = COMPUTER;
      } else {
        this.state[2][2] = COMPUTER;
      }
      return true;
    } else if (s[2] + s[6] === PLAYER) {
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

  _randomMove() {
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

export { EMPTY, PLAYER, COMPUTER, Game };
