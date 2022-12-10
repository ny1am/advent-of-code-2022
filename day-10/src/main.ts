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
type Command = {
  cycles: number;
  value: number;
};

function parseCommand(line: string): Command {
  if (line === "noop") {
    return { cycles: 1, value: 0 };
  }
  if (line.startsWith("addx")) {
    return { cycles: 2, value: Number(line.split(" ")[1]) };
  }
  throw new Error(`${line} command is unknown`);
}

{
  let x = 1;
  let clock = 1;
  let part1 = 0;

  lines.forEach((line) => {
    const command = parseCommand(line);
    for (let i = 0; i < command.cycles; i++) {
      //during
      if ([20, 60, 100, 140, 180, 220].includes(clock)) {
        const signal = x * clock;
        part1 += signal;
      }
      //after
      if (i === command.cycles - 1) {
        x += command.value;
      }
      clock++;
    }
  });

  console.log("part1", part1); //12460
}

{
  let x = 1;
  let clock = 1;
  let part2Line = "";

  lines.forEach((line) => {
    const command = parseCommand(line);
    for (let i = 0; i < command.cycles; i++) {
      //during
      const crt = (clock - 1) % 40;
      if (crt >= x - 1 && crt <= x + 1) {
        part2Line += "*";
      } else {
        part2Line += " ";
      }
      //after
      if (i === command.cycles - 1) {
        x += command.value;
      }
      clock++;
    }
  });

  function chunkString(str, length) {
    return str.match(new RegExp(".{1," + length + "}", "g"));
  }

  console.log("part2", chunkString(part2Line, 40));
}
