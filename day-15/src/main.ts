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
type Observation = { sensor: Point; beacon: Point };

const observations: Observation[] = lines.map((line) => {
  const parts = line.match(/-?(\d+)/g).map((v) => Number(v));
  return {
    sensor: { x: parts[0], y: parts[1] },
    beacon: { x: parts[2], y: parts[3] },
  };
});

function findPointDistance(p1: Point, p2: Point): number {
  return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
}

function findRowDistance(p1: Point, y: number): number {
  return Math.abs(p1.y - y);
}

function findCoveredRange(
  obs: Observation,
  y: number
): [number, number] | null {
  const pointDistance = findPointDistance(obs.sensor, obs.beacon);
  const rowDistance = findRowDistance(obs.sensor, y);
  const diff = pointDistance - rowDistance;
  if (diff < 0) {
    return null;
  }
  return [obs.sensor.x - diff, obs.sensor.x + diff];
}

function combineSortedRanges(ranges: [number, number][]) {
  let i = 0;
  while (i < ranges.length - 1) {
    if (ranges[i][1] >= ranges[i + 1][0]) {
      ranges[i + 1][0] = ranges[i][0];
      ranges[i + 1][1] = Math.max(ranges[i][1], ranges[i + 1][1]);
      ranges[i] = null;
      return combineSortedRanges(ranges.filter(Boolean));
    }
    i++;
  }
  return ranges;
}

function combineRanges(ranges: [number, number][]) {
  const result = [...ranges].sort((a, b) => {
    const startComp = a[0] - b[0];
    return startComp || a[1] - b[1];
  });
  return combineSortedRanges(result);
}

// part 1
const searchableRow = 2000000;
const ranges = combineRanges(
  observations
    .map((obs) => findCoveredRange(obs, searchableRow))
    .filter(Boolean)
);

const beaconsOnSearchableRow = observations
  .map((obs) => obs.beacon)
  .filter((p) => p.y === searchableRow)
  .map((p) => p.x)
  .filter((x, idx, self) => self.indexOf(x) === idx)
  .filter((x) => ranges.some((r) => x >= r[0] && x <= r[1]));

const part1 =
  ranges.map((r) => Math.abs(r[1] - r[0]) + 1).reduce((a, b) => a + b) -
  beaconsOnSearchableRow.length;

console.log("part1", part1); //5367037

//part 2
let y;
let x;
for (y = 0; y <= 4000000; y++) {
  const ranges = combineRanges(
    observations.map((obs) => findCoveredRange(obs, y)).filter(Boolean)
  );
  if (ranges.length > 1) {
    x = ranges[0][1] + 1;
    break;
  }
}
console.log("part2", x * 4000000 + y);
