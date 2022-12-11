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

//part 1
const cfgs = groups.map((raw) => {
  const lines = raw.split(/\r?\n/).filter(Boolean);

  const [id] = lines[0].match(/(\d+)/g);
  const items = lines[1].match(/(\d+)/g).map(Number);

  const calc = Function(
    "old",
    lines[2].replace("Operation: ", "").replace("new =", "return").trim()
  ) as (v: number) => number;

  const [divisibleArg] = lines[3].match(/(\d+)/g).map(Number);
  const [trueRedirect] = lines[4].match(/(\d+)/g);
  const [falseRedirect] = lines[5].match(/(\d+)/g);
  const test = (value: number): string => {
    return value % divisibleArg === 0 ? trueRedirect : falseRedirect;
  };
  return { id, items, calc, test, divisibleArg };
});

{
  const itemsMap = new Map(cfgs.map((m) => [m.id, [...m.items]]));

  const accessLog = new Map(cfgs.map((m) => [m.id, 0]));
  const log = (id: string) => {
    accessLog.set(id, accessLog.get(id) + 1);
  };

  for (let i = 0; i < 20; i++) {
    cfgs.forEach(({ id, calc, test }) => {
      while (itemsMap.get(id).length > 0) {
        log(id);
        const item = itemsMap.get(id).shift();
        const newItem = Math.floor(calc(item) / 3);
        const redirectMonkey = test(newItem);
        itemsMap.get(redirectMonkey).push(newItem);
      }
    });
  }

  const part1 = [...accessLog.values()]
    .sort((a, b) => b - a)
    .slice(0, 2)
    .reduce((m, i) => m * i);
  console.log("part1", part1);
}

{
  const itemsMap = new Map(cfgs.map((m) => [m.id, [...m.items]]));

  const accessLog = new Map(cfgs.map((m) => [m.id, 0]));
  const log = (id: string) => {
    accessLog.set(id, accessLog.get(id) + 1);
  };

  const magicNumber = cfgs.map((c) => c.divisibleArg).reduce((a, b) => a * b);

  for (let i = 0; i < 10_000; i++) {
    cfgs.forEach(({ id, calc, test }) => {
      while (itemsMap.get(id).length > 0) {
        log(id);
        const item = itemsMap.get(id).shift();
        let newItem = calc(item) % magicNumber;
        const redirectMonkey = test(newItem);
        itemsMap.get(redirectMonkey).push(newItem);
      }
    });
  }

  const part2 = [...accessLog.values()]
    .sort((a, b) => b - a)
    .slice(0, 2)
    .reduce((m, i) => m * i);
  console.log("part2", part2);
}
