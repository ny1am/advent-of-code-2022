import path from "path";
import fs from "fs";

//setup
const fetchData = () => {
  const fileName = path.resolve(process.cwd(), "input.txt");
  const fileContent = fs.readFileSync(fileName, "utf-8");
  return fileContent;
};

type Point = [number, number, number];

const coords = fetchData()
  .split(/\r?\n/)
  .filter(Boolean)
  .map((line) => line.split(",").map(Number)) as Point[];

// coords.forEach((p) =>
//   console.log(`translate([${p[0]}, ${p[1]}, ${p[2]}]) {cube(1);}`)
// );

function areNeighbors(p1: Point, p2: Point) {
  const distance =
    Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1]) + Math.abs(p1[2] - p2[2]);
  return distance <= 1;
}

//part 1
{
  let sum = 0;
  for (let i = 0; i < coords.length; i++) {
    sum += 6;
    for (let k = 0; k < i; k++) {
      if (areNeighbors(coords[i], coords[k])) {
        sum -= 2;
      }
    }
  }
  console.log("part 1", sum);
}
