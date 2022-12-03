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
const getPriority = (s: string) => {
  if (s.toLowerCase() === s) {
    return s.charCodeAt(0) - 96;
  }
  return s.charCodeAt(0) - 64 + 26;
};

const part1 = lines.reduce((sum, line) => {
  const head = line.substring(0, line.length / 2);
  const tail = line.substring(line.length / 2);
  const duplicated = Array.from(head).find((c) => tail.includes(c)) || "";
  return sum + getPriority(duplicated);
}, 0);

console.log("part1", part1);

//part2
const groups = lines.reduce((res: [string, string, string][], line, idx) => {
  if (idx % 3 === 0) {
    res.push([] as any);
  }
  const lastGroup = res.at(-1) as string[];
  lastGroup.push(line);
  return res;
}, []);

const part2 = groups.reduce(
  (sum, [first, second, third]: [string, string, string]) => {
    const badge =
      Array.from(first).find((c) => second.includes(c) && third.includes(c)) ||
      "";
    return sum + getPriority(badge);
  },
  0
);

console.log("part2", part2);
