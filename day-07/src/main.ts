import path from "path";
import fs from "fs";
// import util from "util";

//setup
const fetchData = () => {
  const fileName = path.resolve(process.cwd(), "input.txt");
  const fileContent = fs.readFileSync(fileName, "utf-8");
  return fileContent;
};

const lines = fetchData().split(/\r?\n/).filter(Boolean);

//part 1
type Node = FileNode | FolderNode;
type FileNode = { name: string; size: number };
type FolderNode = { name: string; children: Node[]; size?: number };

const [, ...tailLines] = lines;
const initNode: FolderNode = { name: "/", children: [] };

function isConsoleOutput(line: string): boolean {
  return !line.startsWith("$");
}

function createNode(line: string): Node {
  const parts = line.split(" ");
  return parts[0] === "dir"
    ? { name: parts[1], children: [] }
    : { name: parts[1], size: Number(parts[0]) };
}

const tree: FolderNode = tailLines.reduce(
  (cfg, line) => {
    if (isConsoleOutput(line)) {
      const newNode = createNode(line);
      cfg.trace.at(-1).children.push(newNode);
      return cfg;
    }

    if (line === "$ ls") {
      return cfg;
    }

    if (line === "$ cd ..") {
      cfg.trace.pop();
      return cfg;
    }

    if (line.startsWith("$ cd ")) {
      const dir = line.substring("$ cd ".length);
      const newCurrent = cfg.trace
        .at(-1)
        .children.find((c) => c.name === dir) as FolderNode;
      cfg.trace.push(newCurrent);
      return cfg;
    }

    throw new Error("should not happen");
  },
  { tree: initNode, trace: [initNode] }
).tree;

// console.log(util.inspect(tree, false, null, true));

function walk(node: FolderNode, folders: FolderNode[]) {
  if (node.children.length === 0) {
    return folders;
  }

  node.children
    .filter((c): c is FolderNode => "children" in c)
    .forEach((child) => {
      walk(child, folders);
    });

  node.size = node.children.reduce((acc, item) => acc + (item.size ?? 0), 0);
  folders.push(node);
  return folders;
}

const folders = walk(tree, []);

const part1 = folders
  .filter((f) => f.size <= 100000)
  .reduce((acc, item) => acc + item.size, 0);

console.log("part1", part1);

//part 2
const TOTAL_DISK_SPACE = 70_000_000;
const NEEDED_SPACE = 30_000_000;

const availableSpace =
  TOTAL_DISK_SPACE - folders.find((f) => f.name === "/").size;

const spaceToFreeUp = NEEDED_SPACE - availableSpace;

const part2 = Math.min(
  ...folders.map((f) => f.size).filter((s) => s >= spaceToFreeUp)
);

console.log("part2", part2);
