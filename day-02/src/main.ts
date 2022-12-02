import path from "path";
import fs from "fs";

//setup
const fetchData = () => {
  const fileName = path.resolve(process.cwd(), "input.txt");
  const fileContent = fs.readFileSync(fileName, "utf-8");
  return fileContent;
};

const games = fetchData()
  .split(/\r?\n/)
  .filter(Boolean)
  .map((v) => {
    const [input, output] = v.split(" ");
    return { input, output };
  });

//part 1
const shapeScoreMapping = {
  Rock: 1,
  Paper: 2,
  Scissors: 3,
} as const;
type Shape = keyof typeof shapeScoreMapping;

const outcomeScoreMapping = {
  win: 6,
  draw: 3,
  lose: 0,
} as const;
type Outcome = keyof typeof outcomeScoreMapping;

const winningRules: Array<{ winner: Shape; looser: Shape }> = [
  { winner: "Rock", looser: "Scissors" },
  { winner: "Paper", looser: "Rock" },
  { winner: "Scissors", looser: "Paper" },
];
function play(me: Shape, opponent: Shape): Outcome {
  if (me === opponent) return "draw";
  if (winningRules.some((r) => r.winner === me && r.looser === opponent))
    return "win";
  return "lose";
}

const inputMapping: Record<string, Shape> = {
  A: "Rock",
  B: "Paper",
  C: "Scissors",
};
const outputMapping: Record<string, Shape> = {
  X: "Rock",
  Y: "Paper",
  Z: "Scissors",
};

const part1 = games.reduce((sum, { input, output }) => {
  const myShape = outputMapping[output];
  const opponentsShape = inputMapping[input];
  const outcome = play(myShape, opponentsShape);

  const roundScore = shapeScoreMapping[myShape] + outcomeScoreMapping[outcome];
  return sum + roundScore;
}, 0);

console.log("part1", part1);

//part2
const outcomeMapping: Record<string, Outcome> = {
  X: "lose",
  Y: "draw",
  Z: "win",
};
function playPretend(opponent: Shape, outcome: Outcome): Shape {
  if (outcome === "draw") return opponent;
  if (outcome === "win")
    return winningRules.find((r) => r.looser === opponent)?.winner as Shape;
  return winningRules.find((r) => r.winner === opponent)?.looser as Shape;
}

const part2 = games.reduce((sum, { input, output }) => {
  const outcome = outcomeMapping[output];
  const opponentsShape = inputMapping[input];
  const myShape = playPretend(opponentsShape, outcome);

  const roundScore = shapeScoreMapping[myShape] + outcomeScoreMapping[outcome];
  return sum + roundScore;
}, 0);

console.log("part2", part2);
