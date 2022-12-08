import path from "path";
import fs from "fs";

//setup
const fetchData = () => {
  const fileName = path.resolve(process.cwd(), "input.txt");
  const fileContent = fs.readFileSync(fileName, "utf-8");
  return fileContent;
};

const matrix = fetchData()
  .split(/\r?\n/)
  .filter(Boolean)
  .map((line) => Array.from(line).map(Number));

//part 1
const MAX_HEIGHT = 9;
const SIZE = matrix.length;
type WalkDirection = "left" | "right" | "top" | "bottom";

function getVisibilityMatrix(matrix) {
  const result = new Array(SIZE)
    .fill(null)
    .map(() => new Array(SIZE).fill(false));

  const getXY = (i, j, direction: WalkDirection): [number, number] => {
    if (direction === "left") return [j, i];
    if (direction === "right") return [SIZE - j - 1, i];
    if (direction === "top") return [i, j];
    if (direction === "bottom") return [i, SIZE - j - 1];
  };

  const walkDirection = (direction: WalkDirection) => {
    for (let i = 0; i < SIZE; i++) {
      let max = -1;
      for (let j = 0; j < SIZE; j++) {
        const [x, y] = getXY(i, j, direction);
        const value = matrix[y][x];
        if (value > max) result[y][x] = true;
        max = Math.max(max, value);
        if (max === MAX_HEIGHT) break;
      }
    }
  };

  walkDirection("left");
  walkDirection("right");
  walkDirection("top");
  walkDirection("bottom");

  return result;
}

const visibilityMatrix = getVisibilityMatrix(matrix);

const part1 = visibilityMatrix.reduce(
  (sum, arr) => sum + arr.filter(Boolean).length,
  0
);

console.log("part1", part1); //1736

//part 2
function getScenicMatrix(matrix) {
  const result = new Array(SIZE).fill(null).map(() => new Array(SIZE).fill(1));

  //left
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      let visibleCount = 0;
      for (let k = j - 1; k >= 0; k--) {
        visibleCount++;
        if (matrix[i][k] >= matrix[i][j]) break;
      }
      result[i][j] *= visibleCount;
    }
  }

  //right
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      let visibleCount = 0;
      for (let k = j + 1; k < SIZE; k++) {
        visibleCount++;
        if (matrix[i][k] >= matrix[i][j]) break;
      }
      result[i][j] *= visibleCount;
    }
  }

  //top
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      let visibleCount = 0;
      for (let k = i - 1; k >= 0; k--) {
        visibleCount++;
        if (matrix[k][j] >= matrix[i][j]) break;
      }
      result[i][j] *= visibleCount;
    }
  }

  //bottom
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      let visibleCount = 0;
      for (let k = i + 1; k < SIZE; k++) {
        visibleCount++;
        if (matrix[k][j] >= matrix[i][j]) break;
      }
      result[i][j] *= visibleCount;
    }
  }

  return result;
}

const scenicMatrix = getScenicMatrix(matrix);

const part2 = scenicMatrix.reduce(
  (sum, arr) =>
    Math.max(
      sum,
      arr.reduce((m, item) => Math.max(m, item))
    ),
  0
);

console.log("part2", part2); //268800
