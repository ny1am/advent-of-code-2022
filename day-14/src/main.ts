import path from "path";
import fs from "fs";

//setup
const fetchData = () => {
  const fileName = path.resolve(process.cwd(), "input.txt");
  const fileContent = fs.readFileSync(fileName, "utf-8");
  return fileContent;
};

const lines = fetchData().split(/\r?\n/).filter(Boolean);

type Point = { x: number; y: number };
type Path = Point[];
type Bounds = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};
type Map = string[][];

const paths: Path[] = lines.map((line) =>
  line
    .split(" -> ")
    .map((rp) => rp.split(","))
    .map(([xStr, yStr]) => ({ x: Number(xStr), y: Number(yStr) }))
);

function getBounds(paths: Path[]): Bounds {
  const flat = paths.flat();
  const xs = flat.map((p) => p.x);
  const ys = flat.map((p) => p.y);
  return {
    left: Math.min(...xs),
    right: Math.max(...xs),
    top: Math.min(...ys),
    bottom: Math.max(...ys),
  };
}

function findDestinationDirection(
  p1: Point,
  p2: Point
): "top" | "bottom" | "left" | "right" {
  if (p1.x < p2.x) return "right";
  if (p1.x > p2.x) return "left";
  if (p1.y < p2.y) return "bottom";
  return "top";
}

function drawLine(map: Map, p1: Point, p2: Point) {
  const dd = findDestinationDirection(p1, p2);
  if (dd === "right") {
    for (let i = p1.x; i <= p2.x; i++) {
      map[p1.y][i] = "#";
    }
  }
  if (dd === "left") {
    for (let i = p2.x; i <= p1.x; i++) {
      map[p1.y][i] = "#";
    }
  }
  if (dd === "bottom") {
    for (let i = p1.y; i <= p2.y; i++) {
      map[i][p1.x] = "#";
    }
  }
  if (dd === "top") {
    for (let i = p2.y; i <= p1.y; i++) {
      map[i][p1.x] = "#";
    }
  }
  return map;
}

function createMap(rawPaths): Map {
  const shiftX = -getBounds(rawPaths).left;
  const paths = rawPaths.map((path) =>
    path.map((p) => ({ x: p.x + shiftX, y: p.y }))
  );

  const { right, bottom } = getBounds(paths);
  let map = new Array(bottom + 1)
    .fill(null)
    .map(() => new Array(right + 1).fill("."));

  paths.forEach((path) => {
    for (let i = 0; i < path.length - 1; i++) {
      map = drawLine(map, path[i], path[i + 1]);
    }
  });

  map[0][shiftX + 500] = "+";

  return map;
}

function testEmpty(map: Map, p: Point): boolean {
  const line = map[p.y] || "";
  return !["o", "#"].includes(line[p.x]);
}

function moveSandDown(map: Map, p: Point): Point {
  const down = { x: p.x, y: p.y + 1 };
  if (testEmpty(map, down)) return down;
  const downLeft = { x: p.x - 1, y: p.y + 1 };
  if (testEmpty(map, downLeft)) return downLeft;
  const downRight = { x: p.x + 1, y: p.y + 1 };
  if (testEmpty(map, downRight)) return downRight;
  return p;
}

function produceSand(map) {
  const startPoint = { y: 0, x: map[0].findIndex((v) => v === "+") };
  let point = { ...startPoint };
  const newMap = map;
  let done = false;
  while (true) {
    const nextPoint = moveSandDown(newMap, point);
    if (
      nextPoint.x < 0 ||
      nextPoint.y < 0 ||
      nextPoint.x >= map[0].length ||
      nextPoint.y >= map.length
    ) {
      done = true;
      break;
    }
    if (nextPoint.x === point.x && nextPoint.y === point.y) {
      newMap[nextPoint.y][nextPoint.x] = "o";
      break;
    }
    if (nextPoint.x === startPoint.x && nextPoint.y === startPoint.y) {
      done = true;
      break;
    }
    point = nextPoint;
  }
  return { done, newMap };
}

//part 1
{
  let map = createMap(paths);
  let i = 0;
  while (true) {
    const { done, newMap } = produceSand(map);

    if (done) break;

    map = newMap;
    i++;
  }
  console.log("part 1", i); //862
}

//part 2
{
  const sideBuffer = new Array(200).fill(null).map(() => ".");
  const initialMap = createMap(paths).map((row) => [
    ...sideBuffer,
    ...row,
    ...sideBuffer,
  ]);
  let map = [
    ...initialMap,
    initialMap[0].map(() => "."),
    initialMap[0].map(() => "#"),
  ];
  let i = 0;
  while (true) {
    const { done, newMap } = produceSand(map);

    if (done) break;

    map = newMap;
    i++;
  }
  console.log("part 2", i); //28744
}
