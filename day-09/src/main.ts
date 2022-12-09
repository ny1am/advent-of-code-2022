import path from "path";
import fs from "fs";

//setup
const fetchData = () => {
  const fileName = path.resolve(process.cwd(), "input.txt");
  const fileContent = fs.readFileSync(fileName, "utf-8");
  return fileContent;
};

const lines = fetchData().split(/\r?\n/).filter(Boolean);

//part 1
type Instruction = { direction: "U" | "R" | "D" | "L"; steps: number };
const instructions = lines
  .map((line) => line.split(" "))
  .map(
    (parts) => ({ direction: parts[0], steps: Number(parts[1]) } as Instruction)
  );

type Point = { x: number; y: number };

function moveOneStep(p: Point, direction: Instruction["direction"]): Point {
  if (direction === "U") return { ...p, y: p.y - 1 };
  if (direction === "D") return { ...p, y: p.y + 1 };
  if (direction === "L") return { ...p, x: p.x - 1 };
  if (direction === "R") return { ...p, x: p.x + 1 };
}

function areAdjacent(p1: Point, p2: Point): boolean {
  return Math.abs(p1.x - p2.x) <= 1 && Math.abs(p1.y - p2.y) <= 1;
}

function moveTail(head: Point, tail: Point): Point {
  if (areAdjacent(head, tail)) return tail;
  const xDistance = tail.x - head.x;
  const yDistance = tail.y - head.y;
  let result = tail;
  if (xDistance) {
    result = moveOneStep(result, xDistance > 0 ? "L" : "R");
  }
  if (yDistance) {
    result = moveOneStep(result, yDistance > 0 ? "U" : "D");
  }
  return result;
}

function createHash(p: Point): string {
  return `${p.x}_${p.y}`;
}

const part1 = instructions.reduce(
  (cfg, instruction) => {
    for (let i = 0; i < instruction.steps; i++) {
      cfg.head = moveOneStep(cfg.head, instruction.direction);
      cfg.tail = moveTail(cfg.head, cfg.tail);
      cfg.visited.add(createHash(cfg.tail));
    }
    return cfg;
  },
  { head: { x: 0, y: 0 }, tail: { x: 0, y: 0 }, visited: new Set() }
).visited.size;

console.log("part1", part1); //6175

//part 2
const part2 = instructions.reduce(
  (cfg, instruction) => {
    for (let i = 0; i < instruction.steps; i++) {
      cfg.head = moveOneStep(cfg.head, instruction.direction);
      for (let b = 0; b < cfg.body.length; b++) {
        cfg.body[b] = moveTail(cfg.body[b - 1] || cfg.head, cfg.body[b]);
      }
      cfg.tail = moveTail(cfg.body.at(-1), cfg.tail);
      cfg.visited.add(createHash(cfg.tail));
    }
    return cfg;
  },
  {
    head: { x: 0, y: 0 },
    body: new Array(8).fill(null).map((_) => ({ x: 0, y: 0 })),
    tail: { x: 0, y: 0 },
    visited: new Set(),
  }
).visited.size;

console.log("part2", part2); //2578
