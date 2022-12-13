import path from "path";
import fs from "fs";

//setup
const fetchData = () => {
  const fileName = path.resolve(process.cwd(), "input.txt");
  const fileContent = fs.readFileSync(fileName, "utf-8");
  return fileContent;
};

const groups = fetchData()
  .split(/\r?\n\r?\n/)
  .filter(Boolean);

const pairs = groups.map((group) => {
  const lines = group.split(/\r?\n/);
  return lines.map((l) => JSON.parse(l));
});

//part 1
type Value = unknown[] | number;

function comparator(a: Value, b: Value): -1 | 0 | 1 {
  if (!Array.isArray(a) && !Array.isArray(b)) {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    for (let i = 0; i < a.length; i++) {
      if (b.length <= i) return 1;
      const sortValue = comparator(a[i], b[i]);
      if (sortValue) return sortValue;
    }
    if (b.length > a.length) return -1;
    return 0;
  }
  const [arrA, arrB] = [[a].flat(), [b].flat()];
  return comparator(arrA, arrB);
}

const part1 = pairs
  .map(([a, b]) => comparator(a, b))
  .map((v, i) => ([-1, 0].includes(v) ? i + 1 : 0))
  .reduce((s, a) => s + a);

console.log("part1", part1);

//part 2
const allValues = [...pairs.flat(), [[2]], [[6]]]
  .sort(comparator)
  .map((v) => JSON.stringify(v));

const idx2 = allValues.findIndex((v) => v === "[[2]]");
const idx6 = allValues.findIndex((v) => v === "[[6]]");
const part2 = (idx2 + 1) * (idx6 + 1);
console.log("part2", part2);
