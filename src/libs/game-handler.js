const GRID_SIZE = 4;
const WINNING_COUNT = 2048;
export const grid = { columns: GRID_SIZE, rows: GRID_SIZE };
export const title = WINNING_COUNT;

export const game = {
  data: () => {
    let blocks = populateRandomValueToEmptyBlock(
      Array.from(Array(grid.columns), () => new Array(grid.rows).fill(0)),
      false
    );
    blocks = populateRandomValueToEmptyBlock(blocks, false);

    return blocks;
  },
  _score: 0,
  _gameOver: false,
  get score() {
    return this._score;
  },
  set score(value) {
    this._score += Number(value || 0);
  },
  reset() {
    localStorage.setItem(`2048_best_score`, this._score);
    this._score = 0;
    this._gameOver = false;
  },
  handleKeyPress(event, data) {
    if (this._gameOver === true) {
      return data;
    }

    const key = event.key;

    let direction = "";

    if (key === "ArrowLeft") direction = "left";
    if (key === "ArrowRight") direction = "right";
    if (key === "ArrowUp") direction = "up";
    if (key === "ArrowDown") direction = "down";

    let modifiedData = data;
    if (direction) {
      modifiedData = modifyData(direction, [...data]);
    }

    return modifiedData;
  },
  isGameOver(blocks) {
    let won = false;
    let zerosCount = 0;

    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        let block = blocks[i][j];

        if (block === 0) zerosCount += 1;
        if (block === WINNING_COUNT) won = true;
      }
    }

    if (won || zerosCount === 0) {
      localStorage.setItem(`2048_best_score`, this._score);
      this._gameOver = true;
    }

    return {
      won,
      gameOver: zerosCount === 0,
    };
  },
};

// helpers

function populateRandomValueToEmptyBlock(blocks, minimumOnly = true) {
  let isNotEmpty = true;
  let x = -1;
  let y = -1;
  while (isNotEmpty) {
    x = Math.floor(Math.random() * grid.rows);
    y = Math.floor(Math.random() * grid.columns);

    if (blocks[x][y] === 0) {
      isNotEmpty = false;
    }
  }

  if (minimumOnly) {
    blocks[x][y] = 2;
  } else {
    blocks[x][y] = [2, 4][Math.floor(Math.random() * 2)];
  }

  return blocks;
}

function modifyData(direction, blocks) {
  for (let i = 0; i < grid.columns; i++) {
    if (direction === "right") {
      blocks[i] = modifyRow(blocks[i].reverse()).reverse();
    }

    if (direction === "left") {
      blocks[i] = modifyRow(blocks[i]);
    }

    if (direction === "up") {
      let row = [];
      for (let j = 0; j < GRID_SIZE; j++) {
        row.push(blocks[j][i]);
      }
      row = modifyRow(row);
      for (let j = 0; j < GRID_SIZE; j++) {
        blocks[j][i] = row[j];
      }
    }

    if (direction === "down") {
      let row = [];
      for (let j = 0; j < GRID_SIZE; j++) {
        row.push(blocks[j][i]);
      }
      row = modifyRow(row.reverse()).reverse();
      for (let j = 0; j < GRID_SIZE; j++) {
        blocks[j][i] = row[j];
      }
    }
  }

  blocks = populateRandomValueToEmptyBlock(blocks);

  return blocks;
}

function modifyRow(row = []) {
  row = row.filter((r) => r !== 0);
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      game.score = row[i];
      row[i] += row[i];
      row[i + 1] = 0;
    }
  }
  row = row.filter((r) => r != 0);
  while (row.length < grid.rows) {
    row.push(0);
  }
  return row;
}
