import path from "path";
import fs from "fs";
import { findShortestPath } from "./findShortestPath.js";

//setup
const fetchData = () => {
  const fileName = path.resolve(process.cwd(), "input.txt");
  const fileContent = fs.readFileSync(fileName, "utf-8");
  return fileContent;
};

const map = fetchData().split(/\r?\n/).filter(Boolean);

//part 1
const width = map[0].length;
const height = map.length;

function getNodeId(x: number, y: number) {
  return x * width + y;
}

function getElevation(v: string): string {
  if (v === "S") return "a";
  if (v === "E") return "z";
  return v;
}

function isLink(v1: string, v2: string): boolean {
  const v1El = getElevation(v1);
  const v2El = getElevation(v2);
  const diff = v1El.charCodeAt(0) - v2El.charCodeAt(0);
  return diff >= -1;
}

function getLabel(x: number, y: number, map: string[]) {
  return map[y][x] === "S"
    ? "start"
    : map[y][x] === "E"
    ? "finish"
    : getNodeId(x, y) + "";
}

const graph = {};
for (let x = 0; x < width; x++) {
  for (let y = 0; y < height; y++) {
    const label = getLabel(x, y, map);

    const res = [
      [0, -1],
      [1, 0],
      [0, 1],
      [-1, 0],
    ]
      .map((e) => ({ x: x + e[0], y: y + e[1] }))
      .filter((v) => v.x >= 0 && v.y >= 0 && v.x < width && v.y < height)
      .reduce((acc, point) => {
        if (isLink(map[y][x], map[point.y][point.x])) {
          acc[getLabel(point.x, point.y, map)] = 1;
        }
        return acc;
      }, {});

    graph[label] = res;
  }
}

const part1 = findShortestPath(graph, "start", "finish").distance;
console.log("part1", part1); //391

//part2
//for every "b" characters x = 1, so the answer = min distance where x = 0
//long live brute force
const part2 = Math.min(
  ...new Array(height).fill(null).map((_, index) => {
    const label = getLabel(0, index, map);
    const res = findShortestPath(graph, label, "finish").distance;
    console.log(label, index, res);
    return res;
  })
);

console.log("part2", part2); //386
