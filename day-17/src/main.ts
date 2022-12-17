import path from "path";
import fs from "fs";
import { findPattern } from "./findPattern.js";

//setup
const fetchData = () => {
  const fileName = path.resolve(process.cwd(), "input.txt");
  const fileContent = fs.readFileSync(fileName, "utf-8");
  return fileContent;
};

function createJetIterator() {
  const pattern = fetchData();
  let i = 0;
  return {
    next: () => pattern[i++ % pattern.length],
  };
}

function createShapesIterator() {
  const shapes = [
    ["####"],
    [".#.", "###", ".#."],
    ["..#", "..#", "###"],
    ["#", "#", "#", "#"],
    ["##", "##"],
  ];
  let i = 0;
  return {
    next: () => shapes[i++ % shapes.length],
  };
}

function createProjection(position, shape, width) {
  const pre = new Array(position.x).fill(".").join("");
  const post = new Array(width - position.x - shape[0].length)
    .fill(".")
    .join("");
  return shape.map((line) => `${pre}${line}${post}`);
}

function mergeLines(mapLine: string, projectionLine: string): null | string {
  const newLine = new Array(mapLine.length).fill(".");
  for (let i = 0; i < mapLine.length; i++) {
    if (mapLine[i] === "#" && projectionLine[i] === "#") return null;
    if (mapLine[i] === "#" || projectionLine[i] === "#") newLine[i] = "#";
  }
  return newLine.join("");
}

function checkIfFits(position, shape, map) {
  if (position.x < 0 || position.x > map[0].length - shape[0].length) {
    return false;
  }
  if (map.length <= position.y) return true;
  const projection = createProjection(position, shape, map[0].length);
  for (let i = projection.length - 1; i >= 0; i--) {
    const lineY = position.y + (projection.length - 1 - i);
    if (lineY >= map.length) continue;
    if (!mergeLines(map[lineY], projection[i])) return false;
  }
  return true;
}

function updateMap(position, shape, map) {
  const projection = createProjection(position, shape, map[0].length);
  if (map.length === position.y) {
    return [...map, ...projection.reverse()];
  }
  const mapHeight = map.length;
  for (let i = projection.length - 1; i >= 0; i--) {
    const lineY = position.y + (projection.length - 1 - i);
    if (lineY >= mapHeight) {
      map.push(projection[i]);
      continue;
    }
    map[lineY] = mergeLines(map[lineY], projection[i]);
  }
  return map;
}

function adjustJet(position, jet, shape, map) {
  const newPosition = { ...position };
  if (jet === "<") {
    newPosition.x = newPosition.x - 1;
  } else {
    newPosition.x = newPosition.x + 1;
  }
  if (checkIfFits(newPosition, shape, map)) {
    return newPosition;
  }
  return position;
}

function iterate(MAX_ITERATIONS: number) {
  const jetIterator = createJetIterator();
  const shapesIterator = createShapesIterator();
  const log = new Map();
  let map = [new Array(7).fill("#").join("")];

  let iterations = 0;
  while (true) {
    if (iterations++ === MAX_ITERATIONS) break;

    const shape = shapesIterator.next();
    let position = { x: 2, y: map.length + 3 };

    let fits = true;
    while (fits) {
      position = adjustJet(position, jetIterator.next(), shape, map);
      const candidate = { ...position, y: position.y - 1 };
      fits = checkIfFits(candidate, shape, map);
      if (fits) {
        position = candidate;
      } else {
        map = updateMap(position, shape, map);
      }
    }

    log.set(iterations, map.length - 1);
  }
  return log;
}

//part 1
{
  const log = iterate(2022);
  console.log("part 1", log.get(2022)); //3219
}

//part 2
{
  const ITERATIONS_NEEDED = 1_000_000_000_000;

  const log = iterate(5000);
  const heightSample = [...log.values()].map(
    (v, i, self) => v - (self[i - 1] ?? 0)
  );

  const { pattern, offset } = findPattern(heightSample);

  const prePatternHeight = heightSample
    .slice(0, offset)
    .reduce((s, v) => s + v);

  const postPatternHeight = pattern
    .slice(0, (ITERATIONS_NEEDED - offset) % pattern.length)
    .reduce((s, v) => s + v);

  const reps = Math.floor((ITERATIONS_NEEDED - offset) / pattern.length);
  const patternHeight = pattern.reduce((s, v) => s + v);

  const part2 = prePatternHeight + reps * patternHeight + postPatternHeight;
  console.log("part 2", part2); //1582758620701
}
