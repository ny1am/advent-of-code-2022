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
interface Range {
  min: number;
  max: number;
}
const parseLine = (l: string): Range[] => {
  const pairs = l.split(",");
  return pairs.map((p) => {
    const nums = p.split("-");
    return { min: Number(nums[0]), max: Number(nums[1]) };
  });
};

const isFullyContained = (base: Range, candidate: Range): boolean => {
  return candidate.min >= base.min && candidate.max <= base.max;
};

const part1 = lines
  .map(parseLine)
  .filter(
    (pairs) =>
      isFullyContained(pairs[0], pairs[1]) ||
      isFullyContained(pairs[1], pairs[0])
  );

console.log("part1", part1.length);

//part 2
const isOverlapping = (r1: Range, r2: Range): boolean => {
  const [first, second] = [r1, r2].sort(
    (a, b) => a.min - b.min || a.max - b.max
  );
  return !(first.max < second.min);
};

const part2 = lines
  .map(parseLine)
  .filter((pairs) => isOverlapping(pairs[0], pairs[1]));

console.log("part2", part2.length);
