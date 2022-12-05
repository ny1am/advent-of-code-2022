import path from "path";
import fs from "fs";
import * as R from "ramda";
import { Stack } from "@datastructures-js/stack";

//setup
const fetchData = () => {
  const fileName = path.resolve(process.cwd(), "input.txt");
  const fileContent = fs.readFileSync(fileName, "utf-8");
  return fileContent;
};

const lines = fetchData().split(/\r?\n/);
const [input, instructions] = R.splitWhen(R.equals(""), lines).map((arr) =>
  arr.filter(Boolean)
);

const [keysInput, stackInput] = R.splitAt(1, input.reverse());
const keyIndexes = Array.from(keysInput[0])
  .map((v, i) => (v !== " " ? i : null))
  .filter((idx) => idx !== null);

const getInitialState = (): Record<string, Stack<string>> =>
  keyIndexes.reduce((res, idx) => {
    const stack = new Stack<string>();
    stackInput
      .map((si) => si[idx])
      .filter((v) => v !== " ")
      .forEach((v) => stack.push(v));
    res[keysInput[0][idx]] = stack;
    return res;
  }, {});

//part 1
const state1 = getInitialState();
instructions.forEach((line) => {
  const rawParts = line.match(/(\d+)/g);
  const [_, source, destination] = rawParts;
  const reps = Number(rawParts[0]);
  for (let i = 0; i < reps; i++) {
    const value = state1[source].pop();
    state1[destination].push(value);
  }
});

const part1 = Object.values(state1)
  .map((s) => s.peek())
  .join("");
console.log("part1", part1);

//part 2
const state2: Record<string, string[]> = Object.entries(
  getInitialState()
).reduce(
  (res, [key, stack]) => ({ ...res, [key]: stack.toArray().reverse() }),
  {}
);
instructions.forEach((line) => {
  const rawParts = line.match(/(\d+)/g);
  const [_, source, destination] = rawParts;
  const reps = Number(rawParts[0]);

  const values = state2[source].splice(0, reps);
  state2[destination].unshift(...values); //bad for performance
});

const part2 = Object.values(state2)
  .map((s) => s.at(0))
  .join("");
console.log("part2", part2);
