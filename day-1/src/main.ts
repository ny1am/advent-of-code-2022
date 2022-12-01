import path from "path";
import fs from "fs";

//setup
const fetchData = () => {
  const fileName = path.resolve(process.cwd(), "input.txt");
  const fileContent = fs.readFileSync(fileName, "utf-8");
  return fileContent;
};

const array = fetchData()
  .split(/\r?\n/)
  .map((v) => (v ? Number(v) : null));

//part 1
const part1 = array.reduce(
  (acc, item) => {
    if (item === null) {
      return { ...acc, current: 0 };
    }
    const newCurrent = item + acc.current;
    return {
      current: newCurrent,
      max: Math.max(acc.max, newCurrent),
    };
  },
  { max: 0, current: 0 }
).max;
console.log("part 1", part1);

//part 2
const createGuardedArray = (maxLength: number) => {
  const array: number[] = [];

  return {
    result: array,
    attemptAdd: (v: number): void => {
      if (array.length < maxLength) {
        array.push(v);
        return void array.sort();
      }
      if (v > array[0]) {
        array[0] = v;
        return void array.sort();
      }
    },
  };
};

const part2 = array
  .reduce(
    ({ maxis, tmpSum }, item) => {
      if (item === null) {
        maxis.attemptAdd(tmpSum);
        return { tmpSum: 0, maxis };
      }
      return {
        tmpSum: item + tmpSum,
        maxis,
      };
    },
    { tmpSum: 0, maxis: createGuardedArray(3) }
  )
  .maxis.result.reduce((acc, a) => acc + a, 0);
console.log(part2);
