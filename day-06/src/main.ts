import path from "path";
import fs from "fs";

//setup
const fetchData = () => {
  const fileName = path.resolve(process.cwd(), "input.txt");
  const fileContent = fs.readFileSync(fileName, "utf-8");
  return fileContent;
};

const text = fetchData();

//part 1
function isMarker(arr: string[]): boolean {
  return new Set(arr).size === 4;
}

let sample = [];
for (var i = 0; i < text.length; i++) {
  sample.push(text[i]);
  if (sample.length > 4) {
    sample.shift();
  }
  if (isMarker(sample)) break;
}
console.log("part 1", i + 1);

//part 2
function isMessage(arr: string[]): boolean {
  return new Set(arr).size === 14;
}

sample = [];
for (var i = 0; i < text.length; i++) {
  sample.push(text[i]);
  if (sample.length > 14) {
    sample.shift();
  }
  if (isMessage(sample)) break;
}
console.log("part 2", i + 1);
